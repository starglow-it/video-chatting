import { IMediaLink } from "shared-types";

export class MediaLink implements IMediaLink {
  src: string;
  thumb: string;
  platform: string;
}
