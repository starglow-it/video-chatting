import { string, object } from 'yup';
import { simpleStringSchema } from '../common';
import { SocialLinkKeysEnum } from '../../store/types';
import { ISocialLink } from 'shared-types';

export const baseUrlSchema = () =>
    string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)?(&[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)*?$/,
        'url.common',
    );

const isStringIsNotEmpty = (link: string) => link.length > 0;

export const youtubeLinkSchema = () =>
    string().when({
        is: isStringIsNotEmpty,
        then: string().matches(
            /((https?):\/\/)?(www.)?youtube(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)?(&[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)+?$/,
            `url.${SocialLinkKeysEnum.Youtube}`,
        ),
    });

export const facebookLinkSchema = () =>
    string().when({
        is: isStringIsNotEmpty,
        then: string().matches(
            /((https?):\/\/)?(www.)?facebook(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)?(&[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)+?$/,
            `url.${SocialLinkKeysEnum.Facebook}`,
        ),
    });

export const instagramLinkSchema = () =>
    string().when({
        is: isStringIsNotEmpty,
        then: string().matches(
            /((https?):\/\/)?(www.)?instagram(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)?(&[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)+?$/,
            `url.${SocialLinkKeysEnum.Instagram}`,
        ),
    });

export const linkedInLinkSchema = () =>
    string().when({
        is: isStringIsNotEmpty,
        then: string().matches(
            /((https?):\/\/)?(www.)?linkedin(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)?(&[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)+?$/,
            `url.${SocialLinkKeysEnum.LinkedIn}`,
        ),
    });

export const twitterLinkSchema = () =>
    string().when({
        is: isStringIsNotEmpty,
        then: string().matches(
            /((https?):\/\/)?(www.)?twitter(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)?(&[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)+?$/,
            `url.${SocialLinkKeysEnum.Twitter}`,
        ),
    });

export const validateSocialLink = () =>
    object()
        .when({
            is: (data: ISocialLink) => data.key === SocialLinkKeysEnum.Youtube,
            then: object({
                key: simpleStringSchema(),
                value: baseUrlSchema(),
            }),
        })
        .when({
            is: (data: ISocialLink) => data.key === SocialLinkKeysEnum.Facebook,
            then: object({
                key: simpleStringSchema(),
                value: baseUrlSchema(),
            }),
        })
        .when({
            is: (data: ISocialLink) => data.key === SocialLinkKeysEnum.Instagram,
            then: object({
                key: simpleStringSchema(),
                value: baseUrlSchema(),
            }),
        })
        .when({
            is: (data: ISocialLink) => data.key === SocialLinkKeysEnum.LinkedIn,
            then: object({
                key: simpleStringSchema(),
                value: baseUrlSchema(),
            }),
        })
        .when({
            is: (data: ISocialLink) => data.key === SocialLinkKeysEnum.Twitter,
            then: object({
                key: simpleStringSchema(),
                value: baseUrlSchema(),
            }),
        })
        .when({
            is: (data: ISocialLink) => data.key === SocialLinkKeysEnum.Custom,
            then: object({
                key: simpleStringSchema(),
                value: baseUrlSchema(),
            }),
        });
