import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { memo, useEffect } from 'react';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { getClientMeetingUrl } from '../../utils/urls';
import { initUserWithoutTokenFx } from '../../store';
import styles from './StartRoomWithoutToken.module.scss';

const StartRoomWithoutTokenContainer = memo(() => {
    const router = useRouter();

    useEffect(() => {
        const { userWithoutLoginId, userTemplateId } = parseCookies();
        if (!userWithoutLoginId) initUserWithoutTokenFx({});
        else router.push(getClientMeetingUrl(userTemplateId));
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            alignItems="center"
            sx={{
                padding: '94px 20px 100px 20px',
            }}
        >
            <CustomGrid
                className={styles.wrapper}
                container
                alignItems="center"
                justifyContent="center"
            >
                <CustomBox className={styles.image}>
                    <CustomImage
                        src="/images/winking-face.webp"
                        width="40px"
                        height="40px"
                        alt="winking-face"
                    />
                </CustomBox>
                <CustomTypography
                    variant="h1"
                    nameSpace="welcome"
                    translation="settingUpRoom"
                />
            </CustomGrid>
        </CustomGrid>
    );
});

export { StartRoomWithoutTokenContainer };
