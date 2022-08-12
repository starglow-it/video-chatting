import React, { memo, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

// hooks
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// components
import { ResetPassword } from '@components/ResetPassword/ResetPassword';
import { NotValidLink } from '@components/NotValidLink/NotValidLink';
import { ResetSuccessful } from '@components/ResetPassword/ResetSuccessful';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// styles
import styles from './ResetPasswordContainer.module.scss';

// stores
import { checkResetPasswordLinkFx } from '../../store';

const Component = () => {
    const router = useRouter();

    const isConfirmPending = useStore(checkResetPasswordLinkFx.pending);

    const [error, setError] = useState('');

    const { value: isUserConfirmed, onSwitchOn: handleSetUserConfirmed } = useToggle(false);

    const { value: isResetSuccessful, onSwitchOn: handleShowResetSuccessful } = useToggle(false);

    useEffect(() => {
        (async () => {
            if (router?.query?.token) {
                const response = await checkResetPasswordLinkFx({
                    token: router?.query?.token as string,
                });

                if (response?.error?.message) {
                    return setError(response?.error?.message);
                }

                handleSetUserConfirmed();
            }
        })();
    }, [router?.query?.token]);

    const handleShowSuccess = useCallback(() => {
        handleShowResetSuccessful();
    }, []);

    return (
        <CustomPaper className={styles.wrapper}>
            <ConditionalRender
                condition={isUserConfirmed && !isConfirmPending && !isResetSuccessful}
            >
                <ResetPassword onSuccessfulReset={handleShowSuccess} />
            </ConditionalRender>

            <ConditionalRender condition={Boolean(error) && !isConfirmPending}>
                <NotValidLink />
            </ConditionalRender>

            <ConditionalRender condition={isResetSuccessful}>
                <ResetSuccessful />
            </ConditionalRender>
        </CustomPaper>
    );
};

export const ResetPasswordContainer = memo(Component);
