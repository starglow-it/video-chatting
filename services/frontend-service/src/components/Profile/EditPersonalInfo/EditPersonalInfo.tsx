import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { PersonIcon } from 'shared-frontend/icons/OtherIcons/PersonIcon';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// components
import { LanguagesSelect } from '@components/LanguagesSelect/LanguagesSelect';

// styles
import styles from './EditPersonalInfo.module.scss';

const EditPersonalInfo = memo(() => {
    const {
        formState: { errors },
        register,
    } = useFormContext();

    const currentPositionErrorMessage: string =
        errors?.position?.message?.toString() || '';

    return (
        <CustomPaper className={styles.paperWrapper}>
            <CustomBox
                display="grid"
                gridTemplateColumns="minmax(110px, 192px) 1fr"
                gridTemplateRows="repeat(1, 1fr)"
            >
                <CustomBox gridArea="1/1/1/1">
                    <CustomGrid container alignItems="center">
                        <PersonIcon
                            width="24px"
                            height="24px"
                            className={styles.icon}
                        />
                        <CustomTypography
                            variant="body1"
                            fontWeight="600"
                            nameSpace="profile"
                            translation="personal"
                        />
                    </CustomGrid>
                </CustomBox>
                <CustomGrid
                    gridArea="1/2/1/2"
                    container
                    wrap="nowrap"
                    className={styles.contentWrapper}
                >
                    <CustomGrid
                        container
                        direction="column"
                        justifyContent="center"
                        gap={4}
                    >
                        <CustomInput
                            nameSpace="forms"
                            translation="position"
                            error={currentPositionErrorMessage}
                            {...register('position')}
                        />
                        <LanguagesSelect
                            nameSpace="profile"
                            translation="editProfile.languages"
                        />
                    </CustomGrid>
                </CustomGrid>
            </CustomBox>
        </CustomPaper>
    );
});

export { EditPersonalInfo };
