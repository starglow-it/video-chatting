import { appDialogsApi } from 'src/store/dialogs/init';
import { AppDialogsEnum } from 'src/store/types';
import { RequestSwitchRolePayload } from '../types';

export const handleReceiveRequestSwitchRoleByHost = (
    data: RequestSwitchRolePayload,
) => {
    console.log('#Duy Phan console', data);
    appDialogsApi.openDialog({
        dialogKey: AppDialogsEnum.confirmBecomeParticipantDialog,
    });
};
