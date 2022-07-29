import { setMeetingErrorEvent } from '../../meeting/meetingError/model';
import { setIsUserSendEnterRequest } from '../../meeting/meetingTemplate/model';
import { appDialogsApi } from '../../dialogs/init';
import { AppDialogsEnum } from '../../types';

export const handleMeetingError = ({ message }: { message: string }) => {
    setMeetingErrorEvent(message);

    setIsUserSendEnterRequest(false);

    appDialogsApi.openDialog({
        dialogKey: AppDialogsEnum.meetingErrorDialog,
    });
};
