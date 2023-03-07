import { Injectable } from '@nestjs/common';
import { AwsConnectorService } from '../../services/aws-connector/aws-connector.service';
import * as ffmpeg from 'fluent-ffmpeg';
import * as probe from 'ffmpeg-probe';
import * as stream from 'stream';
import * as fs from "fs/promises";
import { v4 as uuidv4 } from 'uuid';

const extractAudioOptions = ['-q:a', '0', '-map', 'a'];

type ScreenShotData = {
  url: string;
  uploadKey: string;
  resolution: number;
  size: number;
};

@Injectable()
export class TranscodeService {
  constructor(private awsService: AwsConnectorService) {}

  async createVideoScreenShots({
    url,
    mimeType,
    key,
    resolution,
  }): Promise<ScreenShotData> {
    const options = mimeType.includes('video')
      ? [
          '-f image2',
          '-vframes 1',
          '-vcodec libwebp',
          `-s ${resolution.value}`,
          '-ss 00:00:01',
        ]
      : ['-c:v', 'libwebp'];

    const fileName = `${uuidv4()}_${resolution.key}.webp`;

    const uploadKey = `${key}/${fileName}`;
    //
    // const pass = new stream.PassThrough();
    //
    // ffmpeg(url).outputOptions(options).format('webp').pipe(pass, { end: true });
    // const resultUrl = await this.awsService.uploadStreamFile(pass, uploadKey);

    const transcodePromise = new Promise((resolve) => {
      ffmpeg(url)
          .outputOptions(options)
          .output(`./${fileName}`)
          .on('end', () => {
            resolve(`./${fileName}`);
          })
          .run();
    });

    await transcodePromise;

    const file = await fs.readFile(`./${fileName}`);

    const resultUrl = await this.awsService.uploadFile(file, uploadKey);

    const metaData = await this.getFileData({ url: resultUrl });

    fs.rm(`./${fileName}`);

    return {
      url: resultUrl,
      uploadKey,
      resolution: parseInt(resolution.key.replace('p', ''), 10),
      size: metaData.size,
    };
  }

  async getFileData({ url }): Promise<{ size: number; hasAudio: boolean }> {
    const probeData = await probe(url);

    console.log(probeData);

    return {
      size: parseInt(probeData.format.size, 10),
      hasAudio: probeData.streams.some(stream => stream.codec_type === 'audio'),
    };
  }

  async transcodeVideo({ url, key }): Promise<string> {
    try {
      const pass = new stream.PassThrough();

      ffmpeg(url)
        .inputFormat('mp4')
        .videoCodec('libx264')
        .noAudio()
        .outputOptions(['-movflags', 'empty_moov+faststart'])
        .format('mp4')
        .pipe(pass, { end: true });

      return this.awsService.uploadStreamFile(pass, key);
    } catch (e) {
      console.log(e);
    }
  }

  async transcodeImage({ url, uploadKey }): Promise<string> {
    try {
      // const pass = new stream.PassThrough();
      //
      // ffmpeg(url).outputOptions(['-c:v', 'libwebp']).format('webp').pipe(pass, { end: true });
      //
      // return this.awsService.uploadStreamFile(pass, uploadKey);

      const fileName = `${uuidv4()}.webp`;

      const transcodePromise = new Promise((resolve) => {
        ffmpeg(url)
            .outputOptions(['-c:v', 'libwebp'])
            .output(`./${fileName}`)
            .on('end', () => {
              resolve(`./${fileName}`);
            })
            .run();
      });

      await transcodePromise;

      const file = await fs.readFile(`./${fileName}`);

      const resultUrl = await this.awsService.uploadFile(file, uploadKey);

      fs.rm(`./${fileName}`);

      return resultUrl;
    } catch (e) {
      console.log(e);
    }
  }

  async extractTemplateSound({ url, key }): Promise<string> {
    try {
      const pass = new stream.PassThrough();

      ffmpeg(url).outputOptions(extractAudioOptions).format('mp3').pipe(pass, {
        end: true,
      });

      return this.awsService.uploadStreamFile(pass, key);
    } catch (err) {
      console.log(err);
    }
  }
}
