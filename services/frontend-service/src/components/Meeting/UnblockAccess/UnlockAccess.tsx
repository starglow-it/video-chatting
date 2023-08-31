import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { SocialLogin } from '@library/common/SocialLogin/SocialLogin';
import { useStore } from 'effector-react';
import { $meetingTemplateStore } from 'src/store/roomStores';
import { mapEmoji, parseEmoji } from 'shared-utils';
import clsx from 'clsx';
import { registerRoute } from 'src/const/client-routes';
import styles from './UnlockAccess.module.scss';
import config from '../../../const/config';

export const UnlockAccess = () => {
    const meeting = useStore($meetingTemplateStore);

    const handleStartedEmail = () => {
        window.open(`${config.frontendUrl}${registerRoute}`);
    };

    const renderDesc = () => {
        return [1, 2, 3].map(item => {
            return (
                <CustomGrid key={item} className={styles.descItem}>
                    <CustomGrid
                        className={styles.emoji}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {parseEmoji(mapEmoji('1f680'))}
                    </CustomGrid>
                    <CustomTypography
                        nameSpace="meeting"
                        translation={`unlockAccess.decs.${item}`}
                        fontSize={12}
                        marginLeft="10px"
                    />
                </CustomGrid>
            );
        });
    };

    return (
        <CustomGrid className={styles.container}>
            <CustomGrid className={styles.main}>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    marginBottom="10px"
                >
                    <CustomImage
                        src="/images/Ruume.svg"
                        width="150px"
                        height="35px"
                    />
                </CustomGrid>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    marginBottom="10px"
                >
                    <CustomImage
                        src={meeting.url}
                        width="170px"
                        height="100px"
                        className={styles.banner}
                    />
                </CustomGrid>
                <CustomTypography
                    nameSpace="meeting"
                    translation="unlockAccess.title"
                    variant="h5"
                />
                <CustomGrid className={styles.desc}>{renderDesc()}</CustomGrid>
                <SocialLogin
                    className={clsx(styles.btn, styles.email)}
                    onClick={handleStartedEmail}
                >
                    <CustomImage
                        src="/images/email.webp"
                        width="22px"
                        height="25px"
                    />
                    <CustomTypography
                        nameSpace="common"
                        translation="buttons.getStartedEmail"
                        fontSize={13}
                        color="white"
                    />
                </SocialLogin>
                {/* <SocialLogin
                    className={clsx(styles.btn, styles.google)}
                    onClick={handleStartedGoogle}
                >
                    <CustomImage
                        src="/images/logo_google.svg"
                        width="22px"
                        height="25px"
                    />
                    <CustomTypography
                        nameSpace="common"
                        translation="buttons.getStartedGoogle"
                        fontSize={13}
                        color="white"
                    />
                </SocialLogin> */}
            </CustomGrid>
        </CustomGrid>
    );
};
