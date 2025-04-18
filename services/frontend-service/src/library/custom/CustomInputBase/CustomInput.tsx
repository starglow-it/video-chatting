import { useMemo, forwardRef, memo, ForwardedRef } from 'react';
import { InputBase } from '@mui/material';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';

// types
import { CustomInputProps } from '@library/custom/CustomInput/types';

// styles
import styles from './CustomInput.module.scss';

const Component = (
    { nameSpace, translation, placeholder, error, ...rest }: CustomInputProps,
    ref: ForwardedRef<HTMLInputElement>,
) => {
    const t = useLocalization(nameSpace);

    const label = useMemo(
        () => (translation ? t.translation(translation) : ''),
        [translation],
    );

    return (
        <CustomGrid
            container
            direction="column"
            className={styles.inputWrapper}
            alignItems="center"
        >
            <InputBase
                inputRef={ref}
                placeholder={placeholder || label}
                error={Boolean(error)}
                className={styles.inputBase}
                {...rest}
            />
            {error && (
                <ErrorMessage className={styles.errorContainer} error={error} />
            )}
        </CustomGrid>
    );
};

export const CustomInput = memo(forwardRef(Component));
