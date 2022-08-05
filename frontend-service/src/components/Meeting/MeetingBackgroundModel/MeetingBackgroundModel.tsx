import React, { memo, useRef, useLayoutEffect } from 'react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import styles from './MeetingBackgroundModel.module.scss';

import { startModel } from '../../../models';

const Component: React.FunctionComponent<any> = ({ children }) => {
    const modelWrapperRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (modelWrapperRef.current) {
            const canvas = startModel(
                '/templates/models/draco/',
                '/templates/models/models/static/solution_2.glb',
            );

            modelWrapperRef.current.appendChild(canvas);
            canvas.className = styles.canvas;
        }
    }, []);

    return (
        <CustomGrid ref={modelWrapperRef} className={styles.backgroundModel}>
            {children}
        </CustomGrid>
    );
};

export const MeetingBackgroundModel = memo(Component);
