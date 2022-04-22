import React, { memo, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {useFormContext, useWatch} from 'react-hook-form';
import { useStore } from 'effector-react';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// helper
import { reduceValuesNumber } from '../../../helpers/mics/reduceKeysNumber';
import { padArray } from '../../../utils/arrays/padArray';

// styles
import styles from './SubmitProfileInfo.module.scss';

// stores
import { $appDialogsStore, appDialogsApi } from '../../../store/dialogs';
import { setRouteToChangeEvent } from '../../../store/other';
import { $profileStore } from '../../../store/profile';

// types
import { AppDialogsEnum, SocialLink } from '../../../store/types';
import { SubmitProfileInfoProps } from './types';

// const
import { SOCIAL_LINKS } from '../../../const/profile/socials';

const SubmitProfileInfo = memo(({ onReset }: SubmitProfileInfoProps) => {
    const router = useRouter();

    const profile = useStore($profileStore);
    const { confirmChangeRouteDialog } = useStore($appDialogsStore);

    const {
        control,
        formState: { dirtyFields },
    } = useFormContext();

    const handleResetForm = useCallback(() => {
        onReset?.();
    }, [onReset]);

    const nextSocials = useWatch({
        control,
        name: 'socials'
    });

    const dirtyFieldsCount = useMemo(() => {
        const { socials, ...dirtyFieldsWithOutSocials } = dirtyFields;

        const dirtyFieldsCount = Object.values(dirtyFieldsWithOutSocials).reduce(
            reduceValuesNumber,
            0,
        );

        const paddedNextSocials = padArray<SocialLink>(nextSocials, Object.keys(SOCIAL_LINKS).length);
        const paddedCurrentSocials = padArray<SocialLink>(
            profile?.socials,
            Object.keys(SOCIAL_LINKS).length,
        );

        const changedFields = paddedCurrentSocials.map(social => {
            const targetSocial = paddedNextSocials?.find(
                currentSocial => currentSocial?.key === social?.key,
            );
            const isBothEmpty = targetSocial?.value === undefined && social?.value === undefined;

            const isExistedNotChanged =
                targetSocial?.value && targetSocial?.value === social?.value;

            return isBothEmpty || isExistedNotChanged;
        });

        const changedNewFields = paddedNextSocials
            .map(social => {
                const targetSocial = paddedCurrentSocials?.find(
                    currentSocial => currentSocial?.key === social?.key,
                );

                return !targetSocial?.value && social?.value;
            })
            .filter(Boolean);

        const numberOfChangedFields = changedFields.filter(value => !value).length;

        return dirtyFieldsCount + numberOfChangedFields + changedNewFields.length;
    }, [Object.keys(dirtyFields).length, nextSocials, profile.socials]);

    const handleChangeRoute = useCallback(
        route => {
            if (dirtyFieldsCount && !confirmChangeRouteDialog) {
                router.events.emit('routeChangeError');
                setRouteToChangeEvent(route);

                appDialogsApi.openDialog({
                    dialogKey: AppDialogsEnum.confirmChangeRouteDialog,
                });

                throw 'routeChange aborted';
            }
        },
        [dirtyFieldsCount, confirmChangeRouteDialog],
    );

    useEffect(() => {
        router.events.on('routeChangeStart', handleChangeRoute);

        return () => {
            router.events.off('routeChangeStart', handleChangeRoute);
        };
    }, [dirtyFieldsCount, handleChangeRoute, confirmChangeRouteDialog]);

    if (!dirtyFieldsCount) return <></>;

    return (
        <CustomPaper className={styles.submitProfile}>
            <CustomGrid container alignItems="center" wrap="nowrap">
                <CustomBox className={styles.image}>
                    <Image src="/images/edit-hand.png" width="24px" height="24px" alt="edit-hand" />
                </CustomBox>
                <CustomTypography
                    nameSpace="profile"
                    translation="editProfile.submitProfile.newChanges"
                />
                &nbsp;
                <CustomTypography fontWeight={600}>{dirtyFieldsCount}</CustomTypography>
                <CustomButton
                    className={styles.confirmButton}
                    type="submit"
                    nameSpace="common"
                    translation="buttons.save"
                    typographyProps={{
                        variant: 'body2',
                    }}
                />
                <CustomButton
                    className={styles.cancelButton}
                    onClick={handleResetForm}
                    variant="custom-cancel"
                    nameSpace="common"
                    translation="buttons.cancel"
                    typographyProps={{
                        variant: 'body2',
                    }}
                />
            </CustomGrid>
        </CustomPaper>
    );
});

export { SubmitProfileInfo };
