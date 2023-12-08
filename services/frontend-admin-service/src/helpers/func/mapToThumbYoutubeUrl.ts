import { getYoutubeId } from "shared-utils";

export const mapToThumbYoutubeUrl = (url: string) => {
    const yId = getYoutubeId(url);
    return yId ? `https://img.youtube.com/vi/${yId}/maxresdefault.jpg` : '';
};
