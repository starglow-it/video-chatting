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
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

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
                    let url = link.item;

                    if (!url.match(/^https?:\/\//i)) {
                        url = 'http://' + url;
                    }

                    return window.open(url, '_blank');
                };

                return (
                    <CustomTooltip
                        {...(isGoodsVisible ? { open: true } : {})}
                        key={`${link.id}_${isGoodsVisible}`}
                        nameSpace="meeting"
                        translation="links.title"
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
                            style={style}
                            className={styles.linkItem}
                            onClick={handleOpenLink}
                        >
                            <CustomImage
                                width={20}
                                height={20}
                                src="/images/link.png"
                            />
                        </CustomBox>
                    </CustomTooltip>
                );
            }),
        [meetingTemplate?.links, isGoodsVisible],
    );

    return <>{renderItems}</>;
};

export const MeetingGoodsLinks = memo(Component);
