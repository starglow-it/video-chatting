import React, { memo } from 'react';
import { Tooltip, TooltipProps } from '@mui/material';
import clsx from 'clsx';

// hooks
import { useLocalization } from '@hooks/useTranslation';

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
        tooltipClassName,
        title,
        variant = 'primary',
        options,
        ...rest
    }: TranslationProps & CustomTooltipProps & Omit<TooltipProps, 'title'>) => {
        const { translation: t } = useLocalization(nameSpace);

        return (
            <Tooltip
                classes={{
                    popper: clsx(popperClassName, styles.popper, {
                        [styles.blackGlass]: variant === 'black-glass',
                        [styles.white]: variant === 'white',
                    }),
                    tooltip: clsx(styles.tooltip, tooltipClassName),
                    arrow: styles.arrow,
                }}
                title={title ?? t(translation, options)}
                {...rest}
            >
                {children}
            </Tooltip>
        );
    },
);

export { CustomTooltip };
