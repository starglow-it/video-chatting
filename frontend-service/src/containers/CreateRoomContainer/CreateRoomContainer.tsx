import React, { memo, useCallback, useEffect, useLayoutEffect } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';

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
import { EditTemplateDescription } from '@components/CreateRoom/EditTemplateDescription/EditTemplateDescription';
import { EditAttendeesPosition } from '@components/CreateRoom/EditAttendeesPosition/EditAttendeesPosition';

// hooks
import { useValueSwitcher } from '@hooks/useValueSwitcher';
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { usePrevious } from '@hooks/usePrevious';

// icons
import { CloseIcon } from '@library/icons/CloseIcon';

// const
import { createRoomRoute, dashboardRoute } from 'src/const/client-routes';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from 'src/const/templates/info';

// types
import { ValuesSwitcherItem } from '@library/common/ValuesSwitcher/types';
import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import { AppDialogsEnum } from '../../store/types';

// validation
import { simpleStringSchemaWithLength } from '../../validation/common';
import { tagsSchema } from '../../validation/templates/tags';
import { participantsNumberSchema } from '../../validation/templates/participants';

// store
import {
    $isBusinessSubscription,
    $isProfessionalSubscription,
    appDialogsApi,
    getSubscriptionWithDataFx,
    initLandscapeListener,
    initWindowListeners,
    removeLandscapeListener,
    removeWindowListeners,
} from '../../store';

// utils
import { getRandomNumber } from '../../utils/numbers/getRandomNumber';

// styles
import styles from './CreateRoomContainer.module.scss';

const tabsValues: ValuesSwitcherItem[] = [
    { id: 1, value: 'background', label: 'Background' },
    { id: 2, value: 'description', label: 'Description' },
    { id: 3, value: 'attendees', label: 'Attendees' },
    { id: 4, value: 'preview', label: 'Preview' },
];

const defaultValues: IUploadTemplateFormData = {
    name: '',
    description: '',
    customLink: '',
    tags: [],
    participantsNumber: 1,
    participantsPositions: [{ left: 50, top: 50, id: '1' }],
};

const validationSchema = yup.object({
    name: simpleStringSchemaWithLength(MAX_NAME_LENGTH).required('required'),
    description: simpleStringSchemaWithLength(MAX_DESCRIPTION_LENGTH).required('required'),
    participantsNumber: participantsNumberSchema().required('required'),
    tags: tagsSchema(),
});

const Component = () => {
    const isBusinessSubscription = useStore($isBusinessSubscription);
    const isProfessionalSubscription = useStore($isProfessionalSubscription);

    const router = useRouter();

    const resolver = useYupValidationResolver<IUploadTemplateFormData>(validationSchema, {
        reduceArrayErrors: true,
    });

    const methods = useForm<IUploadTemplateFormData>({
        defaultValues,
        resolver,
        mode: 'onChange',
    });

    const { control, setValue } = methods;

    const participantsNumber = useWatch({ control, name: 'participantsNumber' });
    const participantsPositions = useWatch({ control, name: 'participantsPositions' });

    const previousParticipantsNumber = usePrevious(participantsNumber);

    const { activeValue, activeItem, onValueChange, onNextValue, onPreviousValue } =
        useValueSwitcher({
            values: tabsValues,
            initialValue: tabsValues[0].value,
        });

    useSubscriptionNotification(createRoomRoute);

    useEffect(() => {
        if (!previousParticipantsNumber || participantsNumber === previousParticipantsNumber) {
            return;
        }

        if (previousParticipantsNumber > participantsNumber) {
            setValue('participantsPositions', participantsPositions.slice(0, participantsNumber));
            return;
        }

        const newPositions = [...participantsPositions];
        for (let i = 0; i < (participantsNumber - previousParticipantsNumber); i += 1) {
            newPositions.push({
                left: 50,
                top: 50,
                id: getRandomNumber(10000).toString(),
            });
        }
        setValue('participantsPositions', newPositions);
    }, [participantsNumber, previousParticipantsNumber, participantsPositions]);

    useEffect(() => {
        getSubscriptionWithDataFx();
    }, []);

    useEffect(() => {
        if (!isBusinessSubscription && !isProfessionalSubscription) {
            router.push(dashboardRoute);
        }
    }, [isBusinessSubscription, isProfessionalSubscription]);

    useLayoutEffect(() => {
        initWindowListeners();
        initLandscapeListener();

        return () => {
            removeWindowListeners();
            removeLandscapeListener();
        };
    }, []);

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
                        <ConditionalRender condition={activeValue === 'description'}>
                            <EditTemplateDescription
                                onNextStep={onNextValue}
                                onPreviousStep={onPreviousValue}
                            />
                        </ConditionalRender>
                        <ConditionalRender condition={activeValue === 'attendees'}>
                            <EditAttendeesPosition
                                onNextStep={onNextValue}
                                onPreviousStep={onPreviousValue}
                            />
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
