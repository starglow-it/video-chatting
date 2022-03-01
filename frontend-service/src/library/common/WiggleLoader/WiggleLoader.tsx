import React, { memo } from 'react';
import clsx from 'clsx';

import styles from './WiggleLoader.module.scss';

import { WiggleLoaderProps } from './types';

const WiggleLoader = memo(({ className }: WiggleLoaderProps) => {
    return <div className={clsx(className, styles.loader)} />;
});

export { WiggleLoader };
