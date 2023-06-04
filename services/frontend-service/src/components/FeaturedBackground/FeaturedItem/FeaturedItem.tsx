import { memo } from 'react';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { IFeaturedBackground } from 'shared-types';
import styles from './FeaturedItem.module.scss';

const Component = ({ item }: { item: IFeaturedBackground }) => {
    const previewImage = (item?.previewUrls || []).find(
        image => image.resolution === 240,
    );
 
    return (
        <CustomGrid
            className={styles.templateContent}
            container
            justifyContent="center"
            alignItems="center"
        >
            <ConditionalRender condition={Boolean(previewImage?.url)}>
                <CustomImage
                    src={previewImage?.url || ''}
                    width="334px"
                    height="190px"
                />
            </ConditionalRender>
        </CustomGrid>
    );
};

export const FeaturedItem = memo(Component);
