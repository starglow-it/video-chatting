export enum SocialLinkKeysEnum {
    Youtube = 'youtube',
    Facebook = 'facebook',
    Instagram = 'instagram',
    LinkedIn = 'linkedin',
    Twitter = 'twitter',
    Custom = 'custom',
}

export type SocialLink = {
    value: string;
    key: string;
};