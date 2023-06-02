import { memo } from 'react';
import { useStore } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { FeaturedList } from './FeaturedList/FeaturedList';
import { $featuredBackgroundStore } from 'src/store';
import styles from './FeaturedBackground.module.scss';

const Component = () => {
    const { list, count } = useStore($featuredBackgroundStore);
    console.log('#Duy Phan console', list)

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
            <FeaturedList count={count} list={list} />
        </CustomGrid>
    );
};

export const FeaturedBackground = memo(Component);
