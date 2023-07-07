import React, { memo } from 'react';
import Link from 'next/link';
import { LinkProps } from 'next/dist/client/link';
import { TypographyProps } from '@mui/material';

import { TranslationProps } from '@library/common/Translation/types';
import { CustomLinkProps } from '@library/custom/CustomLink/types';
import { PropsWithClassName } from 'shared-frontend';
import { CustomTypography } from '../CustomTypography/CustomTypography';

import styles from './CustomLink.module.scss';

const CustomLink = memo(
    ({
        href,
        nameSpace,
        translation,
        className,
        children,
        isExternal,
        onClick,
        ...rest
    }: PropsWithClassName<CustomLinkProps> &
        TypographyProps &
        Partial<TranslationProps> &
        React.PropsWithChildren<LinkProps>) => (
        <Link
            href={href}
            {...(isExternal ? { legacyBehavior: true, target: '_blank' } : {})}
        >
            {nameSpace && translation ? (
                <a className={styles.link} onClick={onClick}>
                    <CustomTypography
                        nameSpace={nameSpace}
                        translation={translation}
                        color="colors.blue.primary"
                        className={className}
                        {...rest}
                    />
                </a>
            ) : (
                children
            )}
        </Link>
    ),
);

export { CustomLink };
