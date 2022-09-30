import React from 'react';

import { InstagramIcon } from '@library/icons/InstagramIcon';
import { TwitterIcon } from '@library/icons/TwitterIcon';
import { LinkedInIcon } from '@library/icons/LinkedInIcon';
import { YoutubeIcon } from '@library/icons/YoutubeIcon';
import { FacebookIcon } from '@library/icons/FacebookIcon';
import { CustomLinkIcon } from '@library/icons/CustomLinkIcon';

import { SocialLink, SocialLinkKeysEnum } from '../../store/types';

export const SOCIALS_ICONS: { [key: string]: React.ElementType } = {
    [SocialLinkKeysEnum.Instagram]: InstagramIcon,
    [SocialLinkKeysEnum.Twitter]: TwitterIcon,
    [SocialLinkKeysEnum.LinkedIn]: LinkedInIcon,
    [SocialLinkKeysEnum.Youtube]: YoutubeIcon,
    [SocialLinkKeysEnum.Facebook]: FacebookIcon,
    [SocialLinkKeysEnum.Custom]: CustomLinkIcon,
};

export const SOCIAL_LINKS: SocialLink[] = [
    { key: SocialLinkKeysEnum.Youtube, value: 'https://youtube.com/' },
    { key: SocialLinkKeysEnum.Facebook, value: 'https://facebook.com/' },
    { key: SocialLinkKeysEnum.Instagram, value: 'https://www.instagram.com/' },
    { key: SocialLinkKeysEnum.LinkedIn, value: 'https://www.linkedin.com/' },
    { key: SocialLinkKeysEnum.Twitter, value: 'https://twitter.com/' },
    { key: SocialLinkKeysEnum.Custom, value: '' },
];
