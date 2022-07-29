export const createHtmlVideo = (path, filename, ext, speed = 1) => {
    const video = document.createElement('video');
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playbackRate = speed;

    const source = document.createElement('source');
    source.src = path + filename + '.' + ext;
    source.type = 'video/' + ext;
    video.append(source);

    const compSource1 = document.createElement('source');
    compSource1.src = path + filename + '.mp4';
    compSource1.type = 'video/mp4';
    video.append(compSource1);

    video.style.display = 'none';
    video.crossOrigin = 'anonymous';

    document.body.append(video);
    video.play();

    return video;
};
