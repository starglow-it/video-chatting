import express, { Request, Response } from 'express';
import { EgressClient, EncodedFileType } from 'livekit-server-sdk';
import { getConfigVar } from "../services/config";
import cors from 'cors';

export const recordRoomMeeting = async () => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    interface RecordingInfo {
        egressId: string | undefined;
        filepath: string;
    }

    let egressClient: EgressClient;
    let egressIdMap = new Map<string, RecordingInfo>();
    let S3_ACCESS_KEY: string;
    let S3_SECRET_KEY: string;
    let S3_HOSTNAME: string;
    let S3_REGION: string;
    let S3_BUCKET_NAME: string;

    async function initializeEgressClient(): Promise<void> {
        try {
            const apiKey = await getConfigVar("livekitApiKey");
            const apiSecret = await getConfigVar("livekitApiSecret");
            const livekitHost = await getConfigVar("livekitHost");
            egressClient = new EgressClient(livekitHost, apiKey, apiSecret);
        } catch (error) {
            console.error('Failed to initialize EgressClient:', error);
            // Handle initialization failure (e.g., terminate the process or retry initialization)
        }
    }

    const extractRegionFromHostname = (hostname: string): string | null => {
        const regex = /^s3\.(.+)\.amazonaws\.com$/;
        const match = hostname.match(regex);
        return match ? match[1] : null;
    }
    async function getS3BucketKeys(): Promise<void> {
        // Consider handling errors if any of these configurations are missing
        S3_ACCESS_KEY = await getConfigVar("vultrAccessKey");
        S3_SECRET_KEY = await getConfigVar("vultrSecretAccessKey");
        S3_HOSTNAME = await getConfigVar("vultrStorageHostname");
        S3_REGION = extractRegionFromHostname(S3_HOSTNAME) || "";
        S3_BUCKET_NAME = await getConfigVar("vultrUploadBucket");
    }

    initializeEgressClient();
    getS3BucketKeys();

    const getDateString = (): string => {
        const date = new Date();
        return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    }

    // Start Recording Endpoint
    app.post('/start-recording', async (req: Request, res: Response) => {
        const roomUrl = req.body.roomUrl as string;

        const urlObject = new URL(roomUrl);
        const pathname = urlObject.pathname;
        const roomId = pathname.split('/').pop();

        const filepath = `livekit-record/${getDateString()}/${roomId}-${Date.now()}.mp4`;
        const output = {
            fileType: EncodedFileType.MP4,
            filepath: filepath,
            s3: {
                accessKey: S3_ACCESS_KEY,
                secret: S3_SECRET_KEY,
                region: S3_REGION,
                bucket: S3_BUCKET_NAME
            }
        };

        const layout = { layout: 'speaker' };

        try {
            const startInfo = await egressClient.startWebEgress(roomUrl, output);
            egressIdMap.set(roomUrl, { egressId: startInfo.egressId, filepath });
            res.status(200).json({ message: 'Recording started', egressId: startInfo.egressId });
        } catch (error) {
            console.error('Error starting recording:', error);
            res.status(500).json({ error: 'Error starting recording' });
        }
    });

    // Stop Recording Endpoint
    app.post('/stop-recording', async (req: Request, res: Response) => {
        const roomUrl = req.body.roomUrl as string;
        const recordingInfo = egressIdMap.get(roomUrl);

        // Check if recording info is available for the room
        if (!recordingInfo) {
            return res.status(404).json({ error: 'Recording for the specified room not found.' });
        }

        try {
            // Check if recording has been started
            if (!recordingInfo.egressId) {
                return res.status(400).json({ message: 'Recording has not been started for this room.' });
            }

            // Stop the recording
            await egressClient.stopEgress(recordingInfo.egressId);
            egressIdMap.delete(roomUrl);

            // Construct the recording URL
            const recordingUrl = `https://${S3_BUCKET_NAME}.${S3_HOSTNAME}/${recordingInfo.filepath}`;
            return res.status(200).json({ message: 'Recording successfully stopped.', url: recordingUrl });
        } catch (error) {
            console.error('Error stopping recording:', error);
            res.status(500).json({ error: 'An error occurred while attempting to stop the recording.' });
        }
    });

    const port = await getConfigVar("mediaServicePort");
    console.log(port);
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};
