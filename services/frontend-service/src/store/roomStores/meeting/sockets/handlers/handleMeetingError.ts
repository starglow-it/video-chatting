import { setMeetingErrorEvent } from '../../meetingError/model';
import { setIsUserSendEnterRequest } from '../../meetingTemplate/model';
import { appDialogsApi } from '../../../../dialogs/init';
import { AppDialogsEnum } from '../../../../types';

export const handleMeetingError = ({ message }: { message: string }) => {
    setMeetingErrorEvent(message);

    setIsUserSendEnterRequest(false);

    appDialogsApi.openDialog({
        dialogKey: AppDialogsEnum.meetingErrorDialog,
    });
};
