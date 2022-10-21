import React, { memo, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// components
import { UserVideoStub } from '@components/CreateRoom/EditAttendeesPosition/UserVideoStub/UserVideoStub';

// icons
import { ArrowLeftIcon } from '@library/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@library/icons/ArrowRightIcon';

// types
import { EditAttendeesPositionProps } from '@components/CreateRoom/EditAttendeesPosition/types';
import { ParticipantPosition } from '@containers/CreateRoomContainer/types';

// styles
import styles from './EditAttendeesPosition.module.scss';

const Component = ({ onNextStep, onPreviousStep }: EditAttendeesPositionProps) => {
    const { control, setValue } = useFormContext();

    const participantsPositions = useWatch({ control, name: 'participantsPositions' });
    const participantsNumber = useWatch({ control, name: 'participantsNumber' });

    const handleChangePosition = useCallback(
        ({ id, top, left }: ParticipantPosition) => {
            const positionIndex = participantsPositions.findIndex(
                ({ id: stubId }) => stubId === id,
            );
            if (positionIndex === -1) {
                return;
            }

            const copy = [...participantsPositions];
            copy[positionIndex] = {
                id,
                top,
                left,
            };
            setValue('participantsPositions', copy);
        },
        [participantsPositions],
    );

    const stubs = useMemo(
        () =>
            participantsPositions.map(({ id, top, left }: ParticipantPosition, index: number) => (
                <UserVideoStub
                    key={id}
                    stubId={id}
                    index={index}
                    position={{ top: top / 100, left: left / 100 }}
                    onPositionChange={handleChangePosition}
                />
            )),
        [participantsPositions],
    );

    return (
        <CustomGrid
            container
            alignItems="center"
            justifyContent="center"
            className={styles.wrapper}
        >
            <CustomPaper variant="black-glass" className={styles.paper}>
                <CustomTypography
                    variant="body2"
                    nameSpace="createRoom"
                    translation="editPositions.attendees"
                    color="colors.white.primary"
                    options={{
                        number: participantsNumber,
                    }}
                />
            </CustomPaper>
            {stubs}
            <CustomGrid
                container
                gap={1.5}
                flexWrap="nowrap"
                justifyContent="center"
                className={styles.buttonsGroup}
            >
                <ActionButton
                    variant="gray"
                    Icon={<ArrowLeftIcon width="32px" height="32px" />}
                    className={styles.actionButton}
                    onAction={onPreviousStep}
                />
                <ActionButton
                    variant="accept"
                    Icon={<ArrowRightIcon width="32px" height="32px" />}
                    className={styles.actionButton}
                    onAction={onNextStep}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const EditAttendeesPosition = memo(Component);
