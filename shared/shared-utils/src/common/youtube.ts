export const getYoutubeId = (url: string) => {
    if(!url) return '';
  const regexYoutube =
    /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const data = url.match(regexYoutube);
  return data?.[2] ?? '';
};
