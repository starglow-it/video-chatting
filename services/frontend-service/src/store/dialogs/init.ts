import { createApi } from 'effector';
import { $appDialogsStore, initialDialogsState } from './model';
import { AppDialogsState, DialogActionPayload } from '../types';

const openDialog = (
    state: AppDialogsState,
    data: DialogActionPayload,
): AppDialogsState => ({
    ...state,
    [data.dialogKey]: true,
});

const closeDialog = (
    state: AppDialogsState,
    data: DialogActionPayload,
): AppDialogsState => ({
    ...state,
    [data.dialogKey]: false,
});

const toggleDialog = (
    state: AppDialogsState,
    data: DialogActionPayload,
): AppDialogsState => ({
    ...state,
    [data.dialogKey]: !state[data.dialogKey],
});

const resetDialogs = (): AppDialogsState => initialDialogsState;

export const appDialogsApi = createApi($appDialogsStore, {
    openDialog,
    closeDialog,
    toggleDialog,
    resetDialogs,
});
