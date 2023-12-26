import { updateLocalUserEvent } from 'src/store/roomStores/users/localUser/model';
import { MeetingAccessStatusEnum } from 'shared-types';
import { MeetingI18nErrorEnum } from 'shared-const';
import { setMeetingErrorEvent } from '../../meetingError/model';
import { appDialogsApi } from '../../../../dialogs/init';
import { AppDialogsEnum } from '../../../../types';

export const handleMeetingError = ({ message }: { message: string }) => {
    if (message) {
        setMeetingErrorEvent(message);

        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
    }
    if (message !== MeetingI18nErrorEnum.MAX_PARTICIPANTS_NUMBER) {
        updateLocalUserEvent({
            accessStatus: MeetingAccessStatusEnum.Settings,
        });
    }
};
