export const MAX_PARTICIPANTS_NUMBER = 10;
export const MAX_DESCRIPTION_LENGTH = 200;
export const MAX_NAME_LENGTH = 60;
export const MAX_CUSTOM_LINK_LENGTH = 50;

export const ACCEPT_MIMES_IMAGE: Record<string, string[]> = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/heic': ['.heic'],
};

export const ACCEPT_MIMES_VIDEO: Record<string, string[]> = {
  'video/mp4': ['.mp4'],
};

export const ACCEPT_MIMES_AUDIO: Record<string, string[]> = {
  'audio/mpeg': ['.mpeg'],
  'audio/x-wav': ['.wav'],
  'audio/wav': ['.wav'],
};

export const ACCEPT_MIMES = { ...ACCEPT_MIMES_IMAGE, ...ACCEPT_MIMES_VIDEO };

export const MAX_SIZE_IMAGE_MB = 20;
export const MAX_SIZE_VIDEO_MB = 320;
export const MAX_SIZE_AUDIO_MB = 5;

export const previewResolutions = [
  { key: '1080p', value: '1920x1080' },
  { key: '720p', value: '1280x720' },
  { key: '540p', value: '960x540' },
  { key: '360p', value: '640x360' },
  { key: '240p', value: '320x240' },
];
