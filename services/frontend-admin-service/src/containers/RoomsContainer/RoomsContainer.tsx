import React, {memo, useCallback, useEffect} from "react";
import { useStore } from "effector-react";

//shared
import {CustomChip, CustomGrid, CustomImage, CustomTypography, PlusIcon} from "shared-frontend";

// components
import {Translation} from "@components/Translation/Translation";

// styles
import styles from './RoomsContainer.module.scss';

// store
import {$commonTemplates, createTemplateFx, getCommonTemplatesFx} from "../../store";

const Component = () => {
    const { state: commonTemplates } = useStore($commonTemplates);

    useEffect(() => {
        getCommonTemplatesFx({
            limit: 6,
            skip: 0,
        });
    }, []);

    const handleCreateRoom = useCallback(async () => {
        createTemplateFx();
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            alignItems="center"
            className={styles.wrapper}
        >
            <CustomTypography variant="h1">
                <Translation
                    nameSpace="rooms"
                    translation="common.title"
                />
            </CustomTypography>
            {commonTemplates.count === 0
                ? (
                    <CustomGrid className={styles.noRoomWrapper} container direction="column" justifyContent="center" alignItems="center">
                        <CustomImage src="/images/blush-face.webp" width="40px" height="40px"/>
                        <CustomTypography variant="body2">
                            <Translation
                                nameSpace="rooms"
                                translation="noRooms"
                            />
                        </CustomTypography>
                        <CustomChip
                            active
                            label={
                                <CustomTypography>
                                    <Translation nameSpace="rooms" translation="createRoom" />
                                </CustomTypography>
                            }
                            size="medium"
                            onClick={handleCreateRoom}
                            icon={<PlusIcon width="24px" height="24px" />}
                            className={styles.createRoomButton}
                        />
                    </CustomGrid>
                )
                : (
                    <CustomGrid container justifyContent="center" alignItems="center">
                        <CustomChip
                            active
                            label={
                                <CustomTypography>
                                    <Translation nameSpace="rooms" translation="createRoom" />
                                </CustomTypography>
                            }
                            size="medium"
                            onClick={handleCreateRoom}
                            icon={<PlusIcon width="24px" height="24px" />}
                            className={styles.createRoomButton}
                        />
                    </CustomGrid>
                )
            }
        </CustomGrid>
    )
}

export const RoomsContainer = memo(Component);