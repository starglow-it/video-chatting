import React, { memo } from 'react';
import clsx from 'clsx';

import styles from './CustomLoader.module.scss';

import { CustomLoaderProps } from './CustomLoader.types';

const CustomLoader = memo(({ className }: CustomLoaderProps) => (
    <div className={clsx(className, styles.loader)} />
));

export default CustomLoader;
