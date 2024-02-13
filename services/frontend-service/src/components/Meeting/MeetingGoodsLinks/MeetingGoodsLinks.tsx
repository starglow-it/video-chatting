import React, { memo, useMemo } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// stores
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { $isGoodsVisible } from '../../../store';
import {
    $meetingStore,
    $localUserStore,
    $meetingTemplateStore,
    $isOwner,
    clickMeetingLinkSocketEvent
} from '../../../store/roomStores';

// styles
import styles from './MeetingGoodsLinks.module.scss';

const Component = () => {
    const isGoodsVisible = useStore($isGoodsVisible);
    const meetingTemplate = useStore($meetingTemplateStore);
    console.log(meetingTemplate);
    const localUserStore = useStore($localUserStore);
    const meetingStore = useStore($meetingStore);
    const isOwner = useStore($isOwner);

    const renderItems = useMemo(
        () =>
            (meetingTemplate?.links || []).map((link, index) => {
                const style = {
                    '--top': `${link.position.top * 100}%`,
                    '--left': `${link.position.left * 100}%`,
                } as React.CSSProperties;

                const handleOpenLink = () => {
                    let url = link.item;

                    if (!url.match(/^https?:\/\//i)) {
                        url = `http://${url}`;
                    }

                    if (!isOwner) {
                        clickMeetingLinkSocketEvent({ meetingId: meetingStore.id, url: url, userId: localUserStore.id });
                    }

                    return window.open(url, '_blank');
                };

                return (
                    <CustomTooltip
                        {...(isGoodsVisible ? { open: true } : {})}
                        key={`${index}_${isGoodsVisible}`}
                        title={link.title || undefined}
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
                            display="flex"
                            justifyItems="center"
                            alignItems="center"
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
