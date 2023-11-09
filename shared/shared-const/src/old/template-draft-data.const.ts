import { IBusinessCategory, ICommonTemplate } from 'shared-types';

export const DEFAULT_TEMPLATE_DATA: Partial<ICommonTemplate> = {
  url: '',
  name: '',
  maxParticipants: 1,
  description: '',
  shortDescription: '',
  previewUrls: [],
  type: 'free',
  usersPosition: [],
  isAudioAvailable: true,
  draft: true,
  isPublic: false,
  templateType: 'video',
  isAcceptNoLogin: false,
};

export const CUSTOM_CATEROFY_BUSSINESS = {
  id: 'interior-design',
  key: 'interior-design',
  value: 'Interior Design',
  icon: '01f6cb-fe0f',
  color: 'white',
} as Omit<IBusinessCategory, 'type'>;
