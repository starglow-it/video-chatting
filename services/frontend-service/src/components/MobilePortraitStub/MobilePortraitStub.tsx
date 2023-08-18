import { useStore } from 'effector-react';
import { memo, useState } from 'react';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// icons
import { PortraitIcon } from 'shared-frontend/icons/OtherIcons/PortraitIcon';

// stores
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { $isPortraitLayout } from '../../store';

// styles
import styles from './MobilePortraitStub.module.scss';

const Component = () => {
    const isPortraitLayout = useStore($isPortraitLayout);

    const [isShow, setIsShow] = useState(true);

    return (
        <ConditionalRender condition={isPortraitLayout}>
            <CustomDialog contentClassName={styles.content} open={isShow}>
                <CustomPaper
                    variant="black-glass"
                    className={styles.stubWrapper}
                >
                    <CustomGrid
                        container
                        direction="column"
                        alignItems="center"
                        gap={1.5}
                    >
                        <CustomGrid
                            height="30px"
                            display="flex"
                            justifyContent="flex-end"
                            width="100%"
                        >
                            <RoundCloseIcon
                                isActive
                                width="22px"
                                height="22px"
                                onClick={() => setIsShow(false)}
                            />
                        </CustomGrid>
                        <PortraitIcon width="33px" height="32px" />
                        <CustomTypography
                            textAlign="center"
                            color="colors.white.primary"
                            nameSpace="meeting"
                            translation="portraitLayout.text"
                        />
                        <CustomImage
                            width={28}
                            height={28}
                            src="/images/winking-face.webp"
                            alt="winking-face"
                        />
                    </CustomGrid>
                </CustomPaper>
            </CustomDialog>
        </ConditionalRender>
    );
};

export const MobilePortraitStub = memo(Component);
