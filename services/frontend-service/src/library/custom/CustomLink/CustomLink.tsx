/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { forwardRef, memo } from 'react';
import Link from 'next/link';
import { LinkProps } from 'next/dist/client/link';
import { TypographyProps } from '@mui/material';

import { TranslationProps } from '@library/common/Translation/types';
import { CustomLinkProps } from '@library/custom/CustomLink/types';
import { PropsWithClassName } from 'shared-frontend/types';
import { CustomTypography } from '../CustomTypography/CustomTypography';

import styles from './CustomLink.module.scss';

const BoundComponent = forwardRef(
    (
        { nameSpace, translation, children, className, ...rest }: any,
        ref: any,
    ) => {
        return nameSpace && translation ? (
            <a className={styles.link} ref={ref}>
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
        );
    },
);

const Component = (
    {
        href,
        nameSpace,
        translation,
        className,
        children,
        isExternal,
        ...rest
    }: PropsWithClassName<CustomLinkProps> &
        TypographyProps &
        Partial<TranslationProps> &
        React.PropsWithChildren<LinkProps>,
    ref: any,
) => (
    <Link
        href={href}
        ref={ref}
        passHref
        {...(isExternal ? { legacyBehavior: true, target: '_blank' } : {})}
    >
        <BoundComponent
            nameSpace={nameSpace}
            translation={translation}
            className={className}
            {...rest}
        >
            <>{children}</>
        </BoundComponent>
    </Link>
);
export const CustomLink = memo(forwardRef(Component));
