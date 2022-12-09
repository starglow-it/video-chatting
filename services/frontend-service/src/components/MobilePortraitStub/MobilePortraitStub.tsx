import Backdrop from '@mui/material/Backdrop/Backdrop';
import { useStore } from 'effector-react';
import { memo } from 'react';
import { Portal } from '@mui/base';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// icons
import { PortraitIcon } from 'shared-frontend/icons/OtherIcons/PortraitIcon';

// stores
import { $isPortraitLayout } from '../../../store';

// styles
import styles from './MobilePortraitStub.module.scss';

const Component = () => {
    const isPortraitLayout = useStore($isPortraitLayout);

    return (
        <ConditionalRender condition={isPortraitLayout}>
            <Portal>
                <Backdrop
                    sx={{
                        zIndex: 10001,
                    }}
                    open
                >
                    <CustomPaper variant="black-glass" className={styles.stubWrapper}>
                        <CustomGrid container direction="column" alignItems="center" gap={1.5}>
                            <PortraitIcon width="33px" height="32px" />
                            <CustomTypography
                                textAlign="center"
                                color="colors.white.primary"
                                nameSpace="meeting"
                                translation="portraitLayout.text"
                            />
                        </CustomGrid>
                    </CustomPaper>
                </Backdrop>
            </Portal>
        </ConditionalRender>
    );
};

export const MobilePortraitStub = memo(Component);
