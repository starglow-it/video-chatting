import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import styles from './MeetingChatBar.module.scss';

export const MeetingChatBar = () => {
    return (
        <CustomGrid>
            <CustomInput
                multiline
                inputProps={{ className: styles.textField }}
                placeholder="Type a message"
                InputProps={{
                    classes: {
                        multiline: styles.rootField,
                        focused: styles.focused,
                    },
                }}
            />
        </CustomGrid>
    );
};
