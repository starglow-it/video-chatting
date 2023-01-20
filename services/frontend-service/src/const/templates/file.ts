// utils
import { getFileSizeValue } from '../../utils/functions/getFileSizeValue';

// const
import { FileSizeTypesEnum } from '../../types/fileSize';

export const ACCEPT_MIMES_IMAGE = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/heic': ['.heic'],
};
export const ACCEPT_MIMES_VIDEO = {
    'video/mp4': ['.mp4'],
};
export const ACCEPT_MIMES = { ...ACCEPT_MIMES_IMAGE, ...ACCEPT_MIMES_VIDEO };

export const MAX_SIZE_IMAGE_MB = 5;
export const MAX_SIZE_VIDEO_MB = 10;

export const MAX_SIZE_IMAGE = getFileSizeValue({
    sizeType: FileSizeTypesEnum.megabyte,
    amount: MAX_SIZE_IMAGE_MB,
});
export const MAX_SIZE_VIDEO = getFileSizeValue({
    sizeType: FileSizeTypesEnum.megabyte,
    amount: MAX_SIZE_VIDEO_MB,
});
