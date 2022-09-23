import React, { memo, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { ActionButton } from '@library/common/ActionButton/ActionButton';

// components
import { UserVideoStub } from '@components/CreateRoom/EditAttendeesPosition/UserVideoStub/UserVideoStub';

// icons
import { ArrowLeftIcon } from '@library/icons/ArrowLeftIcon';

// types
import { EditAttendeesPositionProps } from '@components/CreateRoom/EditAttendeesPosition/types';
import { ParticipantPosition } from '@containers/CreateRoomContainer/types';

// styles
import styles from './EditAttendeesPosition.module.scss';

const Component = ({ onNextStep, onPreviousStep }: EditAttendeesPositionProps) => {
    const { control, setValue } = useFormContext();

    const participantsPositions = useWatch({ control, name: 'participantsPositions' });

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
                <CustomGrid
                    item
                    position="absolute"
                    width="100%"
                    height="100%"
                    className={styles.stubWrapper}
                >
                    <UserVideoStub
                        key={id}
                        stubId={id}
                        index={index}
                        position={{ top, left }}
                        onPositionChange={handleChangePosition}
                    />
                </CustomGrid>
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
                    Icon={<ArrowLeftIcon width="24px" height="24px" />}
                    className={styles.actionButton}
                    onAction={onPreviousStep}
                />
                <ActionButton
                    variant="accept"
                    Icon={<ArrowLeftIcon width="24px" height="24px" className={styles.icon} />}
                    className={styles.actionButton}
                    onAction={onNextStep}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const EditAttendeesPosition = memo(Component);
