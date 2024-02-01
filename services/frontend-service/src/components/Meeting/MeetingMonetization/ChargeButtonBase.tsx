import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import clsx from 'clsx';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import { MouseEvent, forwardRef, useImperativeHandle, useState } from 'react';
import { CustomPopover } from '@library/custom/CustomPopover/CustomPopover';
import { useToggle } from '@hooks/useToggle';
import styles from './MeetingMonetization.module.scss';
import { ChargeButtonProps } from './type';

export const ChargeButtonBase = forwardRef(
    (
        {
            children,
            tooltipButton,
            onClose,
            onToggle,
            transformOriginVertical = 450,
        }: ChargeButtonProps,
        ref,
    ) => {
        const {
            value: togglePopover,
            onToggleSwitch: handleTogglePopover,
            onSetSwitch: handleSetPopover,
        } = useToggle(false);
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
                <CustomTooltip title={tooltipButton} placement="top">
                    <CustomPaper
                        variant="black-glass"
                        className={clsx(styles.deviceButton)}
                        aria-describedby="monetization"
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleToggleButton}
                            Icon={
                                <MonetizationIcon width="24px" height="24px" />
                            }
                            style={{
                                borderRadius: 8,
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
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: transformOriginVertical,
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        className: clsx(styles.popoverMonetization),
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
