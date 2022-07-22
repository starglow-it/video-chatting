import { memo, useRef, useLayoutEffect } from "react";

// custom
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";

import styles from './MeetingBackgroundModel.module.scss';

import {startModel} from "../../../models";

const Component = ({ children }) => {
    const modelWrapperRef = useRef();

    useLayoutEffect(() => {
        if (modelWrapperRef.current) {
            const canvas = startModel(
                '/templates/models/draco/',
                '/templates/models/models/static/solution_2.glb'
            );

            modelWrapperRef.current.appendChild(canvas);
            canvas.className = styles.canvas;
        }
    }, []);

    return (
        <CustomGrid ref={modelWrapperRef} className={styles.backgroundModel}>
            {children}
        </CustomGrid>
    )
}

export const MeetingBackgroundModel = memo(Component);