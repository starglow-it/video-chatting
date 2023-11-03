import { useToggle } from '@hooks/useToggle';
import { Drawer } from '@mui/material';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import styles from './MeetingLinksDrawer.module.scss';
import {
    $isToggleLinksDrawer,
    $meetingTemplateStore,
    toggleLinksDrawerEvent,
} from 'src/store/roomStores';
import { useStore } from 'effector-react';

export const MeetingLinksDrawer = () => {
    const open = useStore($isToggleLinksDrawer);
    const meetingTemplate = useStore($meetingTemplateStore);
    const links = meetingTemplate.links ?? [];

    return (
        <Drawer
            open={open}
            onClose={() => toggleLinksDrawerEvent(false)}
            anchor="bottom"
        >
            <CustomGrid height="200px" padding={2}>
                <CustomGrid display="flex" flexWrap="wrap" gap={2}>
                    {links.map((link, index) => (
                        <CustomChip
                            key={index}
                            label={link.item}
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
                        />
                    ))}
                </CustomGrid>
            </CustomGrid>
        </Drawer>
    );
};
