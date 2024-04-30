import { useEffect } from 'react';

import {
    TranscribeStreamingClient,
    StartStreamTranscriptionCommand,
    LanguageCode,
} from '@aws-sdk/client-transcribe-streaming';
import pEvent from 'p-event';

export interface Transcript {
    channel: string;
    partial?: boolean;
    text?: string;
}

export interface LiveTranscriptionProps {
    mediaRecorder: AudioWorkletNode | undefined;
    setMediaRecorder: (m: AudioWorkletNode) => void;
    setTranscriptionClient: (a: TranscribeStreamingClient) => void;
    transcriptionClient: TranscribeStreamingClient | null;
    transcribeStatus: boolean;
    setTranscript: (t: Transcript) => void;
}

export type RecordingProperties = {
    numberOfChannels: number;
    sampleRate: number;
    maxFrameCount: number;
};

export type MessageDataType = {
    message: string;
    buffer: Array<Float32Array>;
    recordingLength: number;
};

const sampleRate = 48000;
const language = 'en-US' as LanguageCode;

const credentials = {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
};

const startStreaming = async (
    handleTranscribeOutput: (
        data: string,
        partial: boolean,
        transcriptionClient: TranscribeStreamingClient,
        mediaRecorder: AudioWorkletNode,
    ) => void,
) => {
    
    const audioContext = new window.AudioContext();
    let stream: MediaStream;
    
    stream = await window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
    });
  
    const source1 = audioContext.createMediaStreamSource(stream);

    const recordingProps: RecordingProperties = {
        numberOfChannels: 1,
        sampleRate: audioContext.sampleRate,
        maxFrameCount: (audioContext.sampleRate * 1) / 10,
    };

    try {
        await audioContext.audioWorklet.addModule(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/worklets/chatruume-processor.js`);
        const mediaRecorder = new AudioWorkletNode(audioContext, 'chatruume-processor', {
            processorOptions: recordingProps,
        });

        const destination = audioContext.createMediaStreamDestination();
        source1.connect(mediaRecorder).connect(destination);
        mediaRecorder.port.postMessage({
            message: 'UPDATE_RECORDING_STATE',
            setRecording: true,
        });

        mediaRecorder.port.onmessageerror = error => {
            console.error(`Error receiving message from worklet: ${error}`);
        };

        const audioDataIterator = pEvent.iterator<
            'message',
            MessageEvent<MessageDataType>
        >(mediaRecorder.port, 'message');

        const getAudioStream = async function* () {
            for await (const chunk of audioDataIterator) {
                if (chunk.data.message === 'SHARE_RECORDING_BUFFER') {
                    const abuffer = pcmEncode(chunk.data.buffer[0]);
                    const audiodata = new Uint8Array(abuffer);
                    yield {
                        AudioEvent: {
                            AudioChunk: audiodata,
                        },
                    };
                }
            }
        };
        const transcribeClient = new TranscribeStreamingClient({
            region: 'us-east-1',
            credentials: credentials,
        });

        const command = new StartStreamTranscriptionCommand({
            LanguageCode: language,
            MediaEncoding: 'pcm',
            MediaSampleRateHertz: sampleRate,
            AudioStream: getAudioStream(),
        });
        const data = await transcribeClient.send(command);

        if (data.TranscriptResultStream) {
            for await (const event of data.TranscriptResultStream) {
                if (event?.TranscriptEvent?.Transcript) {
                    for (const result of event?.TranscriptEvent?.Transcript.Results || []) {
                        if (result?.Alternatives && result?.Alternatives[0].Items) {
                            let completeSentence = ``;
                            for (let i = 0; i < result?.Alternatives[0].Items?.length; i++) {
                                completeSentence += ` ${result?.Alternatives[0].Items[i].Content}`;
                            }
                            handleTranscribeOutput(
                                completeSentence,
                                result.IsPartial || false,
                                transcribeClient,
                                mediaRecorder,
                            );
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error(`An error occurred while setting up the audio processing: ${error}`);
        throw error; // Rethrow to handle it in the calling context
    }
};

const stopStreaming = async (
    mediaRecorder: AudioWorkletNode,
    transcribeClient: { destroy: () => void },
) => {
    if (mediaRecorder) {
        mediaRecorder.port.postMessage({
            message: 'UPDATE_RECORDING_STATE',
            setRecording: false,
        });
        mediaRecorder.port.close();
        mediaRecorder.disconnect();
    } else {
        console.log('No media recorder available to stop');
    }

    if (transcribeClient) {
        transcribeClient.destroy();
    }
};

const pcmEncode = (input: Float32Array) => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
};

const LiveTranscriptions = (props: LiveTranscriptionProps) => {
    const {
        transcribeStatus,
        mediaRecorder,
        transcriptionClient,
        setMediaRecorder,
        setTranscriptionClient,
        setTranscript,
    } = props;

    const onTranscriptionDataReceived = (
        data: string,
        partial: boolean,
        transcriptionClient: TranscribeStreamingClient,
        mediaRecorder: AudioWorkletNode,
    ) => {
        setTranscript({
            channel: '0',
            partial: partial,
            text: data,
        });
        setMediaRecorder(mediaRecorder);
        setTranscriptionClient(transcriptionClient);
    };

    const startRecording = async () => {
        if (!credentials) {
            console.error('Credentials not found');
            return;
        }
        try {
            await startStreaming(onTranscriptionDataReceived);
        } catch (error) {
            alert(`An error occurred while recording: ${error}`);
            await stopRecording();
        }
    };

    const stopRecording = async () => {
        if (mediaRecorder && transcriptionClient) {
            await stopStreaming(mediaRecorder, transcriptionClient);
        } else {
            console.log('No media recorder');
        }
    };

    useEffect(() => {
        startRecording();
    }, []);

    return (
    <>
    </>);
};

export default LiveTranscriptions;
