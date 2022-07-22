import React, { memo, useMemo } from "react";
import { useStore } from "effector-react";

import { CustomTooltip } from "@library/custom/CustomTooltip/CustomTooltip";
import { CustomBox } from "@library/custom/CustomBox/CustomBox";

import {$meetingTemplateStore} from "../../../store";

import styles from './MeetingGoodsLinks.module.scss';

const Component = ({ show }) => {
    const meetingTemplate = useStore($meetingTemplateStore);

    const renderItems = useMemo(() => {
        return (meetingTemplate?.links || []).map(link => {
            const style = {
                '--top': `${link.position.top * 100}%`,
                '--left': `${link.position.left * 100}%`
            } as React.CSSProperties;

            const handleOpenLink = () => {
                window.open(link.item, "_blank");
            }

            return (
                <CustomTooltip
                    {...(show ? { open: true } : {})}
                    key={`${link.id}_${show}`}
                    nameSpace="meeting"
                    translation="links.buyItem"
                    placement="bottom"
                    arrow
                    popperClassName={styles.itemTooltip}
                    componentsProps={{
                        popper: {
                            onClick: handleOpenLink
                        }
                    }}
                >
                    <CustomBox
                        className={styles.linkItem}
                        onClick={handleOpenLink}
                        style={style}
                    >
                        {' '}
                    </CustomBox>
                </CustomTooltip>
            )
        });
    }, [meetingTemplate?.links, show]);

    return (
        <>
            {renderItems}
        </>
    )
}

export const MeetingGoodsLinks = memo(Component);