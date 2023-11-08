import { memo } from 'react';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';

import styles from './RoomsTablePreviewItem.module.scss';

const RoomsTablePreviewItem = memo(
    ({ src, roomName }: { src?: string; roomName: string }) => (
        <CustomGrid
            container
            alignItems="center"
            gap={1.5}
            wrap="nowrap"
            className={styles.wrapper}
        >
            {src ? (
                <CustomImage
                    className={styles.previewImage}
                    width={42}
                    height={28}
                    src={src}
                    alt="rooms-table-preview-item"
                />
            ) : null}
            <CustomTypography className={styles.text} variant="body2">
                {roomName}
            </CustomTypography>
        </CustomGrid>
    ),
);

RoomsTablePreviewItem.displayName = 'RoomsTablePreviewItem';

export { RoomsTablePreviewItem };
