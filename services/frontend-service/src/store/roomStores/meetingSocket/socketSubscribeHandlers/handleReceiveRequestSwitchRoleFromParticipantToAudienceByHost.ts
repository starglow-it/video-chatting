import { appDialogsApi } from 'src/store/dialogs/init';
import { AppDialogsEnum } from 'src/store/types';

export const handleReceiveRequestSwitchRoleFromParticipantToAudienceByHost = () => {
    appDialogsApi.openDialog({
        dialogKey: AppDialogsEnum.confirmBecomeAudienceDialog,
    });
};
