import { memo } from "react";
import Image from 'next/image';

// utils
import {getRandomNumber} from "../../../utils/functions/getRandomNumber";

// custom
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";

// styles
import styles from './ScreenSharingPlaceholder.module.scss';

const images = [
    '/images/winking-face.png',
    '/images/eyes.png',
    '/images/stars.png',
    '/images/time-clock.png',
];

const Component = () => (
        <CustomGrid container direction="column" justifyContent="center" alignItems="center" className={styles.placeholder}>
            <Image src={images[getRandomNumber(3)]} width="40px" height="40px" />
            <CustomTypography variant="body2" color="colors.white.primary" nameSpace="meeting" translation="modes.screensharing.selfSharing" />
        </CustomGrid>
    );

export const ScreenSharingPlaceholder = memo(Component);