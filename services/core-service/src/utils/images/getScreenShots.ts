import * as ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';

const resolutions = [
  { key: '1080p', value: '1920x1080' },
  { key: '720p', value: '1280x720' },
  { key: '540p', value: '960x540' },
  { key: '360p', value: '640x360' },
  { key: '240p', value: '320x240' },
];

export const getScreenShots = async (
  inputPath,
  outputPath,
  fileType = 'video',
) => {
  const promises = resolutions.map((resolution) => {
    return new Promise((resolve, reject) => {
      const options =
        fileType === 'video'
          ? [
              '-f image2',
              '-vframes 1',
              '-vcodec libwebp',
              '-f rawvideo',
              `-s ${resolution.value}`,
              '-ss 00:00:01',
            ]
          : [];

      ffmpeg(inputPath)
        .on('end', function () {
          resolve(`${outputPath}/${uuidv4()}_${resolution.key}.webp`);
        })
        .on('error', function (err) {
          reject(err);
        })
        .outputOptions(options)
        .output(`${outputPath}/${uuidv4()}_${resolution.key}.webp`)
        .run();
    });
  });

  return Promise.all(promises);
};
