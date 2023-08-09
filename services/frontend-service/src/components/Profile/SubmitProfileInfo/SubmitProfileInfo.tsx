import { memo, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useFormContext, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { Translation } from '@library/common/Translation/Translation';

// helper
import { ISocialLink } from 'shared-types';
import { reduceValuesNumber } from '../../../helpers/mics/reduceKeysNumber';
import { padArray } from '../../../utils/arrays/padArray';

// styles
import styles from './SubmitProfileInfo.module.scss';

// stores
import {
    $profileStore,
    $appDialogsStore,
    setRouteToChangeEvent,
    appDialogsApi,
} from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';
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
        name: 'socials',
    });

    const dirtyFieldsCount = useMemo(() => {
        // eslint-disable-next-line
        const { socials, ...dirtyFieldsWithOutSocials } = dirtyFields;

        const fieldsCount = Object.values(dirtyFieldsWithOutSocials).reduce(
            reduceValuesNumber,
            0,
        );

        const paddedNextSocials = padArray<ISocialLink>(
            nextSocials,
            Object.keys(SOCIAL_LINKS).length,
        );
        const paddedCurrentSocials = padArray<ISocialLink>(
            profile?.socials,
            Object.keys(SOCIAL_LINKS).length,
        );

        const changedFields = paddedCurrentSocials.map(social => {
            const targetSocial = paddedNextSocials?.find(
                currentSocial => currentSocial?.key === social?.key,
            );
            const isBothEmpty =
                targetSocial?.value === undefined &&
                social?.value === undefined;

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

        const numberOfChangedFields = changedFields.filter(
            value => !value,
        ).length;

        return fieldsCount + numberOfChangedFields + changedNewFields.length;
    }, [Object.keys(dirtyFields).length, nextSocials, profile.socials]);

    const handleChangeRoute = useCallback(
        (route: string) => {
            if (dirtyFieldsCount && !confirmChangeRouteDialog) {
                router.events.emit('routeChangeError');
                setRouteToChangeEvent(route);

                appDialogsApi.openDialog({
                    dialogKey: AppDialogsEnum.confirmChangeRouteDialog,
                });

                throw new Error('routeChange aborted');
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

    if (!dirtyFieldsCount) return null;

    return (
        <CustomPaper className={styles.submitProfile}>
            <CustomGrid container alignItems="center" wrap="nowrap">
                <CustomBox className={styles.image}>
                    <CustomImage
                        src="/images/edit-hand.webp"
                        width="24px"
                        height="24px"
                        alt="edit-hand"
                    />
                </CustomBox>
                <CustomTypography
                    nameSpace="profile"
                    translation="editProfile.submitProfile.newChanges"
                />
                &nbsp;
                <CustomTypography fontWeight={600}>
                    {dirtyFieldsCount}
                </CustomTypography>
                <CustomButton
                    className={styles.confirmButton}
                    type="submit"
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.save"
                        />
                    }
                    typographyProps={{
                        variant: 'body2',
                    }}
                />
                <CustomButton
                    className={styles.cancelButton}
                    onClick={handleResetForm}
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.cancel"
                        />
                    }
                    variant="custom-cancel"
                    typographyProps={{
                        variant: 'body2',
                    }}
                />
            </CustomGrid>
        </CustomPaper>
    );
});

export { SubmitProfileInfo };
