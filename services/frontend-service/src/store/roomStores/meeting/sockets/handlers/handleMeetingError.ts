import { setMeetingErrorEvent } from '../../meetingError/model';
import { setIsUserSendEnterRequest } from '../../meetingTemplate/model';
import { appDialogsApi } from '../../../../dialogs/init';
import { AppDialogsEnum } from '../../../../types';

export const handleMeetingError = ({ message }: { message: string }) => {
    if (message) {
        setMeetingErrorEvent(message);

        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
    }

    setIsUserSendEnterRequest(false);
};
