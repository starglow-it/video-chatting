import React, { memo } from 'react';
import clsx from 'clsx';

import styles from './WiggleLoader.module.scss';

import { WiggleLoaderProps } from './WiggleLoader.types';

const WiggleLoader = memo(({ className }: WiggleLoaderProps) => (
    <div className={clsx(className, styles.loader)} />
));

export default WiggleLoader;
