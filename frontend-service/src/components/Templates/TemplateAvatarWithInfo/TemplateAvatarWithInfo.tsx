import React, { memo } from "react";

import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";

import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

import {PropsWithClassName} from "../../../types";
import { ProfileAvatarT, Template} from "../../../store/types";

import styles from "./TemplateAvatarWithInfo.module.scss";

const Component = ({ className, avatar, description, name }: PropsWithClassName<{
    name: Template['name'];
    description: Template['description'];
    avatar?: ProfileAvatarT['url'];
}>) => {
    return (
        <CustomGrid container wrap="nowrap" className={className}>
            <ProfileAvatar
                className={styles.avatar}
                src={avatar}
                width="38px"
                height="38px"
                userName={name}
            />
            <CustomGrid container direction="column" className={styles.textWrapper}>
                <CustomTypography
                    variant="body1"
                    fontWeight={600}
                    color="common.white"
                    className={styles.title}
                >
                    {name}
                </CustomTypography>
                <CustomTypography
                    variant="body3"
                    color="common.white"
                    className={styles.description}
                >
                    {description}
                </CustomTypography>
            </CustomGrid>
        </CustomGrid>
    );
}

export const TemplateAvatarWithInfo = memo(Component);