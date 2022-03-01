import React, { memo } from 'react';

import { Theme } from '@mui/material';

import { TranslationProps } from '@library/common/Translation/types';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import styles from './SocialLogin.module.scss';

import { SocialLoginProps } from './types';

const sxStyles = {
    wrapper: {
        background: (theme: Theme) => theme.palette.common.white,
        border: (theme: Theme) => `1px solid ${theme.designSystemColors.stroke.primary}`,
        boxShadow: (theme: Theme) => `0px 12px 24px -4px ${theme.designSystemColors.shadow.normal}`,
        borderRadius: (theme: Theme) => theme.borderRadius.medium,
        '&:hover': {
            boxShadow: (theme: Theme) =>
                `0px 12px 24px -4px ${theme.designSystemColors.shadow.hover}`,
        },
    },
};

const SocialLogin = memo(
    ({ Icon, nameSpace, translation }: SocialLoginProps & TranslationProps) => {
        return (
            <div>
                <CustomGrid
                    container
                    alignItems="center"
                    className={styles.wrapper}
                    sx={sxStyles.wrapper}
                    justifyContent="center"
                >
                    <Icon className={styles.text} width="24px" height="24px" />
                    <CustomTypography nameSpace={nameSpace} translation={translation} />
                </CustomGrid>
            </div>
        );
    },
);

export { SocialLogin };
