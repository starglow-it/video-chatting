import React, { memo, useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';

// hooks
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// components
import { ValuesSwitcher } from '@library/common/ValuesSwitcher/ValuesSwitcher';
import { UploadTemplateFile } from '@components/CreateRoom/UploadTemplateFile/UploadTemplateFile';
import { TemplateBackgroundPreview } from '@components/CreateRoom/TemplateBackgroundPreview/TemplateBackgroundPreview';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';
import { ConfirmCancelRoomCreationDialog } from '@components/Dialogs/ConfirmCancelRoomCreationDialog/ConfirmCancelRoomCreationDialog';

// const
import { createRoomRoute, dashboardRoute } from 'src/const/client-routes';

// hooks
import { useValueSwitcher } from '@hooks/useValueSwitcher';

// icons
import { CloseIcon } from '@library/icons/CloseIcon';

// types
import { ValuesSwitcherItem } from '@library/common/ValuesSwitcher/types';
import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import { AppDialogsEnum } from '../../store/types';

// store
import {
    $isBusinessSubscription,
    $isProfessionalSubscription,
    appDialogsApi,
    getSubscriptionWithDataFx,
} from '../../store';

// styles
import styles from './CreateRoomContainer.module.scss';

const tabsValues: ValuesSwitcherItem[] = [
    { id: 1, value: 'background', label: 'Background' },
    { id: 2, value: 'description', label: 'Description' },
    { id: 3, value: 'participants', label: 'Participants' },
    { id: 4, value: 'preview', label: 'Preview' },
];

const defaultValues: IUploadTemplateFormData = {};

const Component = () => {
    const isBusinessSubscription = useStore($isBusinessSubscription);
    const isProfessionalSubscription = useStore($isProfessionalSubscription);

    const router = useRouter();

    const methods = useForm<IUploadTemplateFormData>({
        defaultValues,
    });

    const { activeValue, activeItem, onValueChange, onNextValue } = useValueSwitcher({
        values: tabsValues,
        initialValue: tabsValues[0].value,
    });

    useSubscriptionNotification(createRoomRoute);

    useEffect(() => {
        getSubscriptionWithDataFx();
    }, []);

    useEffect(() => {
        if (!isBusinessSubscription && !isProfessionalSubscription) {
            router.push(dashboardRoute);
        }
    }, [isBusinessSubscription, isProfessionalSubscription]);

    const handleCancelRoomCreation = useCallback(() => {
        router.push(dashboardRoute);
    }, []);

    const handleOpenCancelConfirmationDialog = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.confirmCancelRoomCreationDialog,
        });
    }, []);

    return (
        <CustomGrid container className={styles.wrapper}>
            <FormProvider {...methods}>
                <form>
                    <TemplateBackgroundPreview>
                        <ConditionalRender condition={activeValue === 'background'}>
                            <UploadTemplateFile onNextStep={onNextValue} />
                        </ConditionalRender>

                        <CustomGrid container className={styles.controlPanel}>
                            <CustomPaper variant="black-glass" className={styles.navigationPaper}>
                                <ValuesSwitcher
                                    values={tabsValues}
                                    optionWidth={115}
                                    activeValue={activeItem}
                                    onValueChanged={onValueChange}
                                    variant="transparent"
                                />
                            </CustomPaper>

                            <CustomTooltip nameSpace="createRoom" translation="tooltips.cancel">
                                <ActionButton
                                    onAction={handleOpenCancelConfirmationDialog}
                                    Icon={
                                        <CloseIcon
                                            className={styles.closeIcon}
                                            width="40px"
                                            height="40px"
                                        />
                                    }
                                    className={styles.closeButton}
                                    variant="gray"
                                />
                            </CustomTooltip>
                        </CustomGrid>
                    </TemplateBackgroundPreview>
                </form>
            </FormProvider>
            <ConfirmCancelRoomCreationDialog onConfirm={handleCancelRoomCreation} />
        </CustomGrid>
    );
};

export const CreateRoomContainer = memo(Component);
