import React from 'react';

import { InstagramIcon } from 'shared-frontend/icons/OtherIcons/InstagramIcon';
import { TwitterIcon } from 'shared-frontend/icons/OtherIcons/TwitterIcon';
import { LinkedInIcon } from 'shared-frontend/icons/OtherIcons/LinkedInIcon';
import { YoutubeIcon } from 'shared-frontend/icons/OtherIcons/YoutubeIcon';
import { FacebookIcon } from 'shared-frontend/icons/OtherIcons/FacebookIcon';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';

import { ISocialLink } from 'shared-types';
import { SocialLinkKeysEnum } from '../../store/types';

export const SOCIALS_ICONS: { [key: string]: React.ElementType } = {
    [SocialLinkKeysEnum.Instagram]: InstagramIcon,
    [SocialLinkKeysEnum.Twitter]: TwitterIcon,
    [SocialLinkKeysEnum.LinkedIn]: LinkedInIcon,
    [SocialLinkKeysEnum.Youtube]: YoutubeIcon,
    [SocialLinkKeysEnum.Facebook]: FacebookIcon,
    [SocialLinkKeysEnum.Custom]: CustomLinkIcon,
};

export const SOCIAL_LINKS: ISocialLink[] = [
    { key: SocialLinkKeysEnum.Youtube, value: 'https://youtube.com/' },
    { key: SocialLinkKeysEnum.Facebook, value: 'https://facebook.com/' },
    { key: SocialLinkKeysEnum.Instagram, value: 'https://www.instagram.com/' },
    { key: SocialLinkKeysEnum.LinkedIn, value: 'https://www.linkedin.com/' },
    { key: SocialLinkKeysEnum.Twitter, value: 'https://twitter.com/' },
    { key: SocialLinkKeysEnum.Custom, value: '' },
];
