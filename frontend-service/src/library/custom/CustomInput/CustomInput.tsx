import React, { useMemo, forwardRef, memo } from 'react';
import { TextField } from '@mui/material';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';

// types
import { CustomInputProps } from '@library/custom/CustomInput/types';

// styles
import styles from './CustomInput.module.scss';

const CustomInput = memo(
    forwardRef(({ nameSpace, translation, error, ...rest }: CustomInputProps, ref) => {
        const t = useLocalization(nameSpace);

        const label = useMemo(() => (translation ? t.translation(translation) : ''), [translation]);

        return (
            <CustomGrid container direction="column">
                <TextField inputRef={ref} label={label} {...rest} error={Boolean(error)} />
                {error && <ErrorMessage className={styles.errorContainer} error={error} />}
            </CustomGrid>
        );
    }),
);

export { CustomInput };
