import { Drawer } from '@mui/material';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import {
    $isToggleLinksDrawer,
    $meetingTemplateStore,
    toggleLinksDrawerEvent,
} from 'src/store/roomStores';
import { useStore } from 'effector-react';
import styles from './MeetingLinksDrawer.module.scss';

export const MeetingLinksDrawer = () => {
    const open = useStore($isToggleLinksDrawer);
    const meetingTemplate = useStore($meetingTemplateStore);
    const links = meetingTemplate.links ?? [];

    const handleOpenLink = (link: any) => {
        let url = link.item;

        if (!url.match(/^https?:\/\//i)) {
            url = `http://${url}`;
        }

        return window.open(url, '_blank');
    };

    return (
        <Drawer
            open={open}
            onClose={() => toggleLinksDrawerEvent(false)}
            anchor="bottom"
        >
            <CustomGrid height="200px" padding={2} overflow="scroll">
                <CustomGrid
                    display="flex"
                    flexWrap="wrap"
                    gap={1}
                    maxHeight="200px"
                >
                    {links.map((link, index) => (
                        <CustomChip
                            key={index}
                            label={link.title || link.item}
                            className={styles.chip}
                            icon={
                                <ActionButton
                                    className={styles.icon}
                                    Icon={
                                        <CustomLinkIcon
                                            width="22px"
                                            height="22px"
                                        />
                                    }
                                />
                            }
                            color="primary"
                            onClick={() => handleOpenLink(link)}
                        />
                    ))}
                </CustomGrid>
            </CustomGrid>
        </Drawer>
    );
};
