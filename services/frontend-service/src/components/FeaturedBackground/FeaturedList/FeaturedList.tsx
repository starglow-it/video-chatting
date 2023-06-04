import { memo, useMemo, } from 'react';
import { IFeaturedBackground } from 'shared-types';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { FeaturedItem } from '../FeaturedItem/FeaturedItem';
import styles from './FeaturedList.module.scss';

const Component = ({ list = [] }: { list: IFeaturedBackground[] }) => {
    const renderTemplates = useMemo(() => {
        return list.map(item => <FeaturedItem key={item.id} item={item} />);
    }, [list.length]);

    return (
        <CustomGrid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className={styles.featuredWrapper}
        >
            <CustomBox className={styles.featuredContent}>
                <CustomGrid container gap={3} justifyContent="center">
                    {renderTemplates}
                </CustomGrid>
            </CustomBox>
        </CustomGrid>
    );
};

export const FeaturedList = memo(Component);
