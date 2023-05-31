import { memo } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import styles from './FeaturedBackground.module.scss';
import { FeaturedList } from './FeaturedList/FeaturedList';

const Component = () => {
    return (
        <CustomGrid
            container
            direction="column"
            className={styles.featuredWrapper}
        >
            <CustomGrid className={styles.image}>
                <CustomImage
                    src="/images/ok-hand.webp"
                    width="30px"
                    height="30px"
                    alt="ok-hand"
                />
                <CustomTypography
                    variant="h5"
                    nameSpace="templates"
                    translation="featuredBackground.title"
                />
            </CustomGrid>
            <CustomTypography
                color="colors.grayscale.semidark"
                nameSpace="templates"
                translation="featuredBackground.description"
            />
            <FeaturedList
                count={8}
                list={[
                    {
                        id: 1,
                        url: 'https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/646ed26d437b2fba5d4834ca/06db5770-4b23-4ebd-b40e-60a5075bbd8f_540p.webp',
                    },
                    {
                        id: 2,
                        url: 'https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/646ed26d437b2fba5d4834ca/06db5770-4b23-4ebd-b40e-60a5075bbd8f_540p.webp',
                    },
                    {
                        id: 3,
                        url: 'https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/646ed26d437b2fba5d4834ca/06db5770-4b23-4ebd-b40e-60a5075bbd8f_540p.webp',
                    },
                    {
                        id: 4,
                        url: 'https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/646ed26d437b2fba5d4834ca/06db5770-4b23-4ebd-b40e-60a5075bbd8f_540p.webp',
                    },
                ]}
            />
        </CustomGrid>
    );
};

export const FeaturedBackground = memo(Component);
