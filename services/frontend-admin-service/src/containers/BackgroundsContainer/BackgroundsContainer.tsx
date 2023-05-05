import { Translation } from '@components/Translation/Translation';
import { memo } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './BackgroundsContainer.module.scss';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';

const Component = () => {
    return (
        <CustomGrid
            container
            direction="column"
            alignItems="center"
            className={styles.wrapper}
        >
            <CustomGrid
                container
                justifyContent="center"
                alignItems="center"
                gap={1.5}
            >
                <CustomTypography variant="h1">
                    <Translation nameSpace="rooms" translation="common.title" />
                </CustomTypography>
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                >
                    <CustomGrid sm={5}>
                        <CustomPaper>
                            <CustomGrid padding="5px">
                                <CustomTypography variant="h4">
                                    <Translation
                                        nameSpace="rooms"
                                        translation="common.title"
                                    />
                                </CustomTypography>
                            </CustomGrid>
                            <CustomGrid container></CustomGrid>
                        </CustomPaper>
                    </CustomGrid>
                    <CustomGrid sm={7}>
                        <CustomPaper>
                            <CustomGrid>ssss</CustomGrid>
                        </CustomPaper>
                    </CustomGrid>
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
};

export const BackgroundsContainer = memo(Component);
