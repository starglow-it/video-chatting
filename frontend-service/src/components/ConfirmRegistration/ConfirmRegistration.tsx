import React, { memo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

import { $registerStore, confirmRegistrationUserFx, resetRegisterErrorEvent } from '../../store';

import styles from './ConfirmRegistration.module.scss';

const ConfirmRegistration = memo(() => {
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
                const response = await confirmRegistrationUserFx(router?.query?.token as string);

                if (response?.error?.message) {
                    setError(response?.error?.message);
                }
            }
        })();
    }, [router?.query?.token]);

    useEffect(() => {
        if (isUserConfirmed || error) {
            setTimeout(() => {
                router.push('/login');
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
                    <CustomGrid container alignItems="center" justifyContent="center">
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
});

export { ConfirmRegistration };
