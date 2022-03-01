import React, { forwardRef, memo } from 'react';
import { useMemo } from 'react';
import { TextField } from '@mui/material';

import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';

import { CustomInputProps } from '@library/custom/CustomInput/types';

import { useLocalization } from '../../../hooks/useTranslation';

import styles from './CustomInput.module.scss';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

const CustomInput = memo(
    forwardRef(({ nameSpace, translation, error, ...rest }: CustomInputProps, ref) => {
        const t = useLocalization(nameSpace);

        const label = useMemo(() => {
            return translation ? t.translation(translation) : '';
        }, [translation]);

        return (
            <CustomGrid container direction="column">
                <TextField inputRef={ref} label={label} {...rest} error={Boolean(error)} />
                {error && <ErrorMessage className={styles.errorContainer} error={error} />}
            </CustomGrid>
        );
    }),
);

export { CustomInput };
