import React, { memo } from 'react';
import { Tooltip, TooltipProps } from '@mui/material';
import clsx from 'clsx';

// hooks
import { useLocalization } from '../../../hooks/useTranslation';

// types
import { TranslationProps } from '@library/common/Translation/types';
import { CustomTooltipProps } from './types';

// styles
import styles from './CustomTooltip.module.scss';

const CustomTooltip = memo(
    ({
        nameSpace,
        translation,
        children,
        popperClassName,
        ...rest
    }: TranslationProps & CustomTooltipProps & Omit<TooltipProps, 'title'>) => {
        const { translation: t } = useLocalization(nameSpace);

        return (
            <Tooltip
                classes={{ popper: clsx(styles.popper, popperClassName) }}
                title={t(translation)}
                {...rest}
            >
                {children}
            </Tooltip>
        );
    },
);

export { CustomTooltip };
