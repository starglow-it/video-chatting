import React, { memo, useMemo } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// stores
import { $isGoodsVisible } from '../../../store';
import { $meetingTemplateStore } from '../../../store/roomStores';

// styles
import styles from './MeetingGoodsLinks.module.scss';

const Component = () => {
    const isGoodsVisible = useStore($isGoodsVisible);
    const meetingTemplate = useStore($meetingTemplateStore);

    const renderItems = useMemo(
        () =>
            (meetingTemplate?.links || []).map(link => {
                const style = {
                    '--top': `${link.position.top * 100}%`,
                    '--left': `${link.position.left * 100}%`,
                } as React.CSSProperties;

                const handleOpenLink = () => {
                    window.open(link.item, '_blank');
                };

                return (
                    <CustomTooltip
                        {...(isGoodsVisible ? { open: true } : {})}
                        key={`${link.id}_${isGoodsVisible}`}
                        nameSpace="meeting"
                        translation="links.buyItem"
                        placement="bottom"
                        arrow
                        popperClassName={styles.itemTooltip}
                        componentsProps={{
                            popper: {
                                onClick: handleOpenLink,
                            },
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
                );
            }),
        [meetingTemplate?.links, isGoodsVisible],
    );

    return <>{renderItems}</>;
};

export const MeetingGoodsLinks = memo(Component);
