import React, { memo } from 'react';
import clsx from 'clsx';

import { Theme } from '@mui/material';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import { TranslationProps } from '@library/common/Translation/types';
import styles from './SocialLogin.module.scss';

import { SocialLoginProps } from './types';
import { PropsWithClassName } from '../../../types';

const sxStyles = {
    wrapper: {
        background: (theme: Theme) => theme.palette.common.white,
        border: (theme: Theme) => `1px solid ${theme.palette.stroke.primary}`,
        boxShadow: (theme: Theme) => `0px 12px 24px -4px ${theme.palette.shadow.normal}`,
        borderRadius: (theme: Theme) => theme.borderRadius.medium,
        '&:hover': {
            boxShadow: (theme: Theme) => `0px 12px 24px -4px ${theme.palette.shadow.hover}`,
        },
    },
};

const Component: React.FunctionComponent<
    PropsWithClassName<SocialLoginProps & TranslationProps>
> = ({ Icon, nameSpace, translation, className, onClick, children }) => (
    <CustomGrid
        container
        alignItems="center"
        className={clsx(styles.wrapper, className)}
        sx={sxStyles.wrapper}
        justifyContent="center"
        onClick={onClick}
    >
        {Icon && <Icon className={styles.text} width="24px" height="24px" />}
        {nameSpace && translation ? (
            <CustomTypography nameSpace={nameSpace} translation={translation} />
        ) : (
            <>{children}</>
        )}
    </CustomGrid>
);

export const SocialLogin = memo(Component);
