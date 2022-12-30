import { FileSizeTypesEnum } from 'shared-types';

const ONE_BYTE = 1;
const ONE_KILOBYTE = ONE_BYTE * 1024;
const ONE_MEGABYTE = ONE_KILOBYTE * 1024;
const ONE_GIGABYTE = ONE_MEGABYTE * 1024;

const fileSizeTypesValues = {
  [FileSizeTypesEnum.byte]: ONE_BYTE,
  [FileSizeTypesEnum.kilobyte]: ONE_KILOBYTE,
  [FileSizeTypesEnum.megabyte]: ONE_MEGABYTE,
  [FileSizeTypesEnum.gigabyte]: ONE_GIGABYTE,
};

export const getFileSizeValue = ({
  amount,
  sizeType,
}: {
  amount: number;
  sizeType: FileSizeTypesEnum;
}) => fileSizeTypesValues[sizeType] * amount;
