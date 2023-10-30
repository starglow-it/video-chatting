import { appDialogsApi } from 'src/store/dialogs/init';
import { AppDialogsEnum } from 'src/store/types';

export const handleReceiveRequestSwitchRoleByHost = () => {
    appDialogsApi.openDialog({
        dialogKey: AppDialogsEnum.confirmBecomeParticipantDialog,
    });
};
