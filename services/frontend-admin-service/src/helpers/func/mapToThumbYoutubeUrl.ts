function getYouTubeVideoId(videoUrl: string) {
    try {
        if (!videoUrl) return null;
        const parsedUrl = new URL(videoUrl);
        if (
            parsedUrl.hostname === 'www.youtube.com' ||
            parsedUrl.hostname === 'youtube.com'
        ) {
            return parsedUrl.searchParams.get('v');
        }
        if (parsedUrl.hostname === 'youtu.be') {
            return parsedUrl.pathname.substr(1);
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

export const mapToThumbYoutubeUrl = (url: string) => {
    const yId = getYouTubeVideoId(url);
    return yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : '';
};
