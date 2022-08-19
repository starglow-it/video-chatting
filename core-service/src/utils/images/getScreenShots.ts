import * as ffmpeg from 'fluent-ffmpeg';

const resolutions = [
  { key: '1080p', value: '1920x1080' },
  { key: '720p', value: '1280x720' },
  { key: '540p', value: '960x540' },
  { key: '360p', value: '640x360' },
  { key: '240p', value: '320x240' },
];

export const getScreenShots = async (inputPath, outputPath) => {
  const promises = resolutions.map((resolution) => {
    return new Promise((resolve, reject) => {
      ffmpeg(`${inputPath}.mp4`)
        .on('end', function () {
          resolve(`${outputPath}_${resolution.key}.png`);
        })
        .on('error', function (err) {
          reject(err);
        })
        .outputOptions([
          '-f image2',
          '-vframes 1',
          '-vcodec png',
          '-f rawvideo',
          `-s ${resolution.value}`,
          '-ss 00:00:01',
        ])
        .output(`${outputPath}_${resolution.key}.png`)
        .run();
    });
  });

  return Promise.all(promises);
};
