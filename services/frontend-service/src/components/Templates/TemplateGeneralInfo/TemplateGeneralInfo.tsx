import { memo, useMemo } from 'react';
import clsx from 'clsx';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// types
import { TemplateGeneralInfoProps } from './types';

// styles
import styles from './TemplateGeneralInfo.module.scss';

// const
import { SIGN_BOARDS } from '../../../const/signBoards';

const TemplateGeneralInfo = memo(
    ({
        profileAvatar = '',
        userName = '',
        companyName = '',
        signBoard,
    }: TemplateGeneralInfoProps) => {
        const isThereSignBoard = Boolean(signBoard) && signBoard !== 'default';

        const targetSignBoard = useMemo(
            () =>
                SIGN_BOARDS.find(signs =>
                    signs.find(board => board.value === signBoard),
                )?.find(board => board.value === signBoard),
            [signBoard],
        );

        return (
            <CustomGrid
                container
                className={clsx(styles.profileInfo, {
                    [styles.withBoard]: isThereSignBoard,
                })}
            >
                <ConditionalRender condition={isThereSignBoard}>
                    <CustomImage
                        src={`/images/boards/${targetSignBoard?.type}/${targetSignBoard?.value}.png`}
                        width="360px"
                        height="244px"
                    />
                </ConditionalRender>
                <CustomGrid
                    gap={1}
                    container
                    className={styles.info}
                    direction={isThereSignBoard ? 'column' : 'row'}
                    justifyContent={isThereSignBoard ? 'center' : 'flex-start'}
                    alignItems="center"
                >
                    <ProfileAvatar
                        className={styles.profileAvatar}
                        src={profileAvatar}
                        userName={userName}
                        width="60px"
                        height="60px"
                    />
                    <CustomBox className={styles.companyName}>
                        <CustomTypography
                            color="colors.white.primary"
                            className={clsx(styles.companyNameTitle, {
                                [styles.withBoard]: isThereSignBoard,
                                [styles.withoutBoard]: !isThereSignBoard,
                            })}
                        >
                            {companyName || 'Company Name'}
                        </CustomTypography>
                    </CustomBox>
                </CustomGrid>
            </CustomGrid>
        );
    },
);

export { TemplateGeneralInfo };
