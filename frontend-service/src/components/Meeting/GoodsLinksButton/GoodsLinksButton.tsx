import React, { memo } from 'react';
import clsx from 'clsx';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import {GoodsIcon} from "@library/icons/GoodsIcon";

// styles
import styles from './GoodsLinkButton.module.scss';

const Component = memo(({ onClick, isActive }: { onClick: () => void; isActive: boolean }) => {
        return (
            <CustomTooltip
                classes={{ tooltip: styles.tooltip }}
                nameSpace="meeting"
                translation={isActive ? "links.offGoods" : "links.onGoods"}
            >
                <CustomPaper variant="black-glass" className={styles.deviceButton}>
                    <ActionButton
                        variant="transparentBlack"
                        onAction={onClick}
                        className={clsx(styles.iconButton, {[styles.disabled]: !isActive })}
                        Icon={<GoodsIcon width="32px" height="32px" />}
                    />
                </CustomPaper>
            </CustomTooltip>
        );
    },
);

export const GoodsLinksButton = memo(Component);
