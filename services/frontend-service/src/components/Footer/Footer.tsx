import React, { memo } from 'react';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomLink } from '@library/custom/CustomLink/CustomLink';

import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { DoubleArrowIcon } from '@library/icons/DoubleArrowIcon';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

import styles from './Footer.module.scss';

const Component = () => {
    const handleScrollUp = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    return (
        <CustomGrid
            container
            alignItems="center"
            justifyContent="center"
            wrap="nowrap"
            className={styles.wrapper}
        >
            <CustomTypography
                variant="body3"
                nameSpace="common"
                translation="footer.company"
                color="colors.grayscale.semidark"
            />
            <CustomGrid container gap={4.5} className={styles.links}>
                <CustomLink
                    variant="body3"
                    nameSpace="common"
                    color="colors.grayscale.semidark"
                    translation="footer.agreements"
                    href="/agreements"
                />
                <ConditionalRender condition={false}>
                    <CustomLink
                        variant="body3"
                        nameSpace="common"
                        color="colors.grayscale.semidark"
                        translation="footer.support"
                        href="/support"
                    />
                </ConditionalRender>
            </CustomGrid>

            <ActionButton
                variant="decline"
                className={styles.scrollButton}
                onAction={handleScrollUp}
                Icon={<DoubleArrowIcon width="24px" height="24px" />}
            />
        </CustomGrid>
    );
};

export const Footer = memo(Component);
