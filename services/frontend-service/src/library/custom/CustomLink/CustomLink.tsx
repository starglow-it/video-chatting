import React, { memo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { LinkProps } from 'next/dist/client/link';
import { TypographyProps } from '@mui/material';

import { TranslationProps } from '@library/common/Translation/types';
import { CustomLinkProps } from '@library/custom/CustomLink/types';
import { CustomTypography } from '../CustomTypography/CustomTypography';

import styles from './CustomLink.module.scss';

const CustomLink = memo(
    ({
        href,
        nameSpace,
        translation,
        className,
        children,
        ...rest
    }: CustomLinkProps &
        TypographyProps &
        Partial<TranslationProps> &
        React.PropsWithChildren<LinkProps>) => (
        <Link href={href}>
            {nameSpace && translation ? (
                <CustomTypography
                    nameSpace={nameSpace}
                    translation={translation}
                    color="colors.blue.primary"
                    className={clsx(styles.link, className)}
                    {...rest}
                />
            ) : (
                children
            )}
        </Link>
    ),
);

export { CustomLink };
