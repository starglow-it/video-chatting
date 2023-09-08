import { IResouce } from '../api-interfaces';
import { QueryParams } from '../common';
export type GetResoucesPayload = {
  ids: string[];
} & QueryParams;

export type UploadResoucePayload = {
  url: IResouce['url'];
  id: string;
  mimeType: string;
  size: number;
  key: string;
};
