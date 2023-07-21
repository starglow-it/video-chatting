import { memo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// stores
import {
    $registerStore,
    confirmRegistrationUserFx,
    resetRegisterErrorEvent,
} from '../../store';

// styles
import styles from './ConfirmRegistration.module.scss';

// const
import { clientRoutes } from '../../const/client-routes';

const Component = () => {
    const router = useRouter();
    const { isUserConfirmed } = useStore($registerStore);
    const [error, setError] = useState('');

    useEffect(
        () => () => {
            resetRegisterErrorEvent();
        },
        [],
    );

    useEffect(() => {
        (async () => {
            if (router?.query?.token) {
                const response = await confirmRegistrationUserFx(
                    router?.query?.token as string,
                );

                if (response?.error?.message) {
                    setError(response?.error?.message);
                }
            }
        })();
    }, [router?.query?.token]);

    useEffect(() => {
        if (isUserConfirmed || error) {
            setTimeout(async () => {
                await router.push(clientRoutes.loginRoute);
            }, 3000);
        }
    }, [isUserConfirmed, error]);

    return (
        <CustomPaper className={styles.wrapper}>
            <CustomGrid container justifyContent="center">
                <CustomTypography
                    variant="h4bold"
                    nameSpace="register"
                    translation="confirm.title"
                />

                {(isUserConfirmed || error) && (
                    <CustomGrid
                        container
                        alignItems="center"
                        justifyContent="center"
                    >
                        <CustomTypography
                            align="center"
                            nameSpace={error ? 'errors' : 'register'}
                            translation={error || 'confirm.success'}
                        />
                        <CustomTypography
                            align="center"
                            nameSpace="register"
                            translation="confirm.redirect"
                        />
                    </CustomGrid>
                )}
            </CustomGrid>
        </CustomPaper>
    );
};

export const ConfirmRegistration = memo(Component);
