import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import styles from './NotFoundContainer.module.scss';
import config from '../../const/config';

export const NotFoundContainer = () => {
    const redirectTo = () => {
        window.location.href = config.frontendUrl;
    };

    return (
        <CustomGrid className={styles.container}>
            <CustomGrid className={styles.main}>
                <CustomTypography
                    className={styles.title}
                    textAlign="center"
                    sx={{ fontSize: { xs: 30, sm: 30, md: 48, xl: 48 } }}
                >
                    What are you looking for?
                </CustomTypography>
                <CustomImage
                    src="https://thumb.tildacdn.com/tild3538-6130-4464-b161-663664323134/-/resize/320x/-/format/webp/eye-in-rip.png"
                    width={160}
                    height={140}
                />
                <CustomGrid display="flex" flexDirection="column">
                    <CustomTypography
                        className={styles.desc}
                        sx={{ fontSize: { xs: 17, sm: 17, md: 20, xl: 20 } }}
                    >
                        the url you typed either doesn&apos;t exist
                    </CustomTypography>
                    <CustomTypography className={styles.desc} paddingLeft={5}>
                        or is a rip in the{' '}
                        <CustomTypography
                            className={styles.descSub}
                            onClick={redirectTo}
                            sx={{
                                fontSize: { xs: 17, sm: 17, md: 20, xl: 20 },
                            }}
                        >
                            continuum
                        </CustomTypography>
                        ...
                    </CustomTypography>
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
};
