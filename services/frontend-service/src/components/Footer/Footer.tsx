import React, { memo } from 'react';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomLink } from '@library/custom/CustomLink/CustomLink';

import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { DoubleArrowIcon } from 'shared-frontend/icons/OtherIcons/DoubleArrowIcon';

import styles from './Footer.module.scss';
import { $appVersionStore } from 'src/store';
import { useStore } from 'effector-react';

const Component = () => {
    const handleScrollUp = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };
    const version = useStore($appVersionStore);

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
				options={{ version: version.appVersion }}
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
                <CustomLink
                    variant="body3"
                    nameSpace="common"
                    color="colors.grayscale.semidark"
                    translation="footer.support"
                    href="/support"
                />

                <CustomLink
                    variant="body3"
                    nameSpace="common"
                    color="colors.grayscale.semidark"
                    translation="footer.howTo"
                    href="https://theliveoffice.com/howto"
                    isExternal
                />

                <CustomLink
                    variant="body3"
                    nameSpace="common"
                    color="colors.grayscale.semidark"
                    translation="footer.faq"
                    href="https://theliveoffice.com/faq"
                    isExternal
                />
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
