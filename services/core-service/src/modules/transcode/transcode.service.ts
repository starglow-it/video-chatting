import { Injectable } from '@nestjs/common';
import {AwsConnectorService} from "../../services/aws-connector/aws-connector.service";
import * as ffmpeg from 'fluent-ffmpeg';
import * as probe from 'ffmpeg-probe';
import * as stream from "stream";
import { v4 as uuidv4 } from 'uuid';

const extractAudioOptions = [
    '-q:a','0',
    '-map','a',
];

type ScreenShotData = {
    url: string;
    uploadKey: string;
    resolution: number;
    size: number
}

@Injectable()
export class TranscodeService {
    constructor(
        private awsService: AwsConnectorService,
    ) {}

    async createVideoScreenShots({ url, mimeType, key, resolution }): Promise<ScreenShotData> {
        const options =
            mimeType === 'video'
                ? [
                    '-f image2',
                    '-vframes 1',
                    '-vcodec libwebp',
                    `-s ${resolution.value}`,
                    '-ss 00:00:01',
                ]
                : [];

        const pass = new stream.PassThrough();

        const uploadKey = `${key}/${uuidv4()}_${resolution.key}.webp`;

        ffmpeg(url)
            .outputOptions(options)
            .format('webp')
            .pipe(pass, { end: true })

        const resultUrl = await this.awsService.uploadStreamFile(pass, uploadKey);

        const metaData = await this.getFileData({ url: resultUrl });

        return {
            url: resultUrl,
            uploadKey,
            resolution: parseInt(resolution.key.replace('p', ''), 10),
            size: metaData.size,
        };
    }

    async getFileData({ url }): Promise<{ size: number }> {
        const probeData = await probe(url);

        return {
            size: parseInt(probeData.format.size, 10),
        }
    }

    async transcodeVideo({ url, key }): Promise<string> {
        try {
            const pass = new stream.PassThrough();

            ffmpeg(url)
                .inputFormat("mp4")
                .videoCodec('libx264')
                .noAudio()
                .outputOptions([
                    '-movflags', 'empty_moov+faststart'
                ])
                .format('mp4')
                .pipe(pass, { end: true })

            return this.awsService.uploadStreamFile(pass, key);
        } catch (e) {
            console.log(e);
        }
    }

    async extractTemplateSound({ url, key }): Promise<string> {
        const pass = new stream.PassThrough();

        ffmpeg(url)
            .outputOptions(extractAudioOptions)
            .format('mp3')
            .pipe(pass, {
                end: true
            })

        return this.awsService.uploadStreamFile(pass, key);
    }
}
