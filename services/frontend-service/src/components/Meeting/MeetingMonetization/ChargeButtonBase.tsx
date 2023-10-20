import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import clsx from 'clsx';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import {
    MouseEvent,
    forwardRef,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react';
import { CustomPopover } from '@library/custom/CustomPopover/CustomPopover';
import { $isPortraitLayout } from 'src/store';
import { useStore } from 'effector-react';
import { useToggle } from '@hooks/useToggle';
import styles from './MeetingMonetization.module.scss';
import { ChargeButtonProps } from './type';

export const ChargeButtonBase = forwardRef(
    (
        { children, tooltipButton, onClose, onToggle }: ChargeButtonProps,
        ref,
    ) => {
        const { isMobile } = useBrowserDetect();
        const isPortraitLayout = useStore($isPortraitLayout);
        const {
            value: togglePopover,
            onToggleSwitch: handleTogglePopover,
            onSetSwitch: handleSetPopover,
        } = useToggle(false);
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

        const styleIcon = useMemo(() => {
            if (isMobile) return { width: '26px', height: '26px' };
            return { width: '32px', height: '32px' };
        }, [isMobile]);

        const handleToggleButton = (e: MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            onToggle?.(!togglePopover);
            setAnchorEl(prev => (prev ? null : e.currentTarget));
            handleTogglePopover();
        };

        const handleCloseButton = () => {
            setAnchorEl(null);
            handleSetPopover(false);
            onClose?.();
        };

        const close = () => {
            setAnchorEl(null);
            handleSetPopover(false);
        };

        useImperativeHandle(ref, () => ({
            close,
        }));

        return (
            <>
                <CustomTooltip title={tooltipButton} placement="left">
                    <CustomPaper
                        variant="black-glass"
                        className={clsx(styles.deviceButton, {
                            [styles.mobile]: isMobile,
                        })}
                        aria-describedby="monetization"
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleToggleButton}
                            Icon={<MonetizationIcon {...styleIcon} />}
                            style={{
                                borderRadius: 12,
                            }}
                        />
                    </CustomPaper>
                </CustomTooltip>
                <CustomPopover
                    id="monetization"
                    open={togglePopover}
                    onClose={handleCloseButton}
                    anchorEl={anchorEl}
                    style={{ zIndex: 20 }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    PaperProps={{
                        className: clsx(styles.popoverMonetization, {
                            [styles.portrait]: isPortraitLayout,
                            [styles.landscape]: !isPortraitLayout && isMobile,
                        }),
                    }}
                >
                    <CustomPaper
                        variant="black-glass"
                        className={styles.commonOpenPanel}
                    >
                        {children}
                    </CustomPaper>
                </CustomPopover>
            </>
        );
    },
);
