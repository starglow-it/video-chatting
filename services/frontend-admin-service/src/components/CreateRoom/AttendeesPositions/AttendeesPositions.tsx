import React, {memo, useCallback, useMemo} from "react";
import {useFormContext, useWatch} from "react-hook-form";

import {ActionButton, ArrowLeftIcon, ArrowRightIcon, CustomGrid, CustomPaper, CustomTypography} from "shared-frontend";

// components
import { Translation } from '@components/Translation/Translation';
import { UserVideoStub } from "@components/CreateRoom/UserVideoStub/UserVideoStub";

import {AttendeesPositionsProps, ParticipantPosition} from "./AttendeesPositions.types";

import styles from "./AttendeesPositions.module.scss";

const Component = ({ onPreviousStep, onNextStep }: AttendeesPositionsProps) => {
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
            participantsPositions.map(({ id, top, left }: ParticipantPosition, index: number) => {
                console.log(top, left)
                return (
                    <UserVideoStub
                        key={id}
                        stubId={id}
                        index={index}
                        position={{
                            top: top / 100,
                            left: left / 100
                        }}
                        onPositionChange={handleChangePosition}
                    />
                )
            }),
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
                    color="colors.white.primary"
                >
                    <Translation
                        nameSpace="rooms"
                        translation="editPositions.attendees"
                        options={{
                            number: participantsNumber,
                        }}
                    />
                </CustomTypography>
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
    )
}

export const AttendeesPositions = memo(Component);