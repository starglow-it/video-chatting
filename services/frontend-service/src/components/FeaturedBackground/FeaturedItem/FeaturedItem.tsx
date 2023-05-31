import { memo } from 'react';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import styles from './FeaturedItem.module.scss';

const Component = ({ item }: { item: any }) => {
    // const previewImage = (item?.previewUrls || []).find(
    //     image => image.resolution === 240,
    // );

    return (
        <CustomGrid
            className={styles.templateContent}
            container
            justifyContent="center"
            alignItems="center"
        >
            <ConditionalRender condition={Boolean(item?.url)}>
                <CustomImage
                    src={item?.url || ''}
                    width="334px"
                    height="190px"
                />
            </ConditionalRender>
        </CustomGrid>
    );
};

export const FeaturedItem = memo(Component);
