import { memo } from 'react';
import clsx from 'clsx';

// shared
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

import { PaymentIcon } from 'shared-frontend/icons/OtherIcons/PaymentIcon';
import { PeopleIcon } from 'shared-frontend/icons/OtherIcons/PeopleIcon';

// styles
import styles from './ProfileTemplateItem.module.scss';

// types
import { ProfileTemplateProps } from './types';

const ProfileTemplateItem = memo(({ template }: ProfileTemplateProps) => {
    const previewImage = (template?.previewUrls || []).find(
        preview => preview.resolution === 240,
    );

    return (
        <CustomGrid
            className={styles.templateContent}
            container
            justifyContent="center"
            alignItems="center"
        >
            <ConditionalRender condition={Boolean(previewImage?.url)}>
                <CustomImage
                    src={previewImage?.url || ''}
                    objectFit="cover" layout="fixed"
                    width={334}
                    height={190}
                    alt="profile-template-item"
                />
            </ConditionalRender>
            <CustomGrid className={styles.templateInfo} display="grid">
                <CustomGrid container wrap="nowrap">
                    <CustomGrid
                        container
                        direction="column"
                        className={styles.textWrapper}
                    >
                        <CustomGrid
                            container
                            flexWrap="nowrap"
                            alignItems="center"
                            gap={0.25}
                        >
                            <PeopleIcon
                                width="20px"
                                height="20px"
                                className={styles.icon}
                            />
                            <CustomTypography
                                variant="body1"
                                fontWeight={600}
                                color="common.white"
                                className={styles.title}
                            >
                                {template.name}
                            </CustomTypography>
                        </CustomGrid>
                        <CustomTypography
                            variant="body3"
                            color="common.white"
                            className={styles.description}
                        >
                            {template.description}
                        </CustomTypography>
                    </CustomGrid>
                </CustomGrid>
                <CustomBox className={styles.emptySpace} />
                <CustomGrid
                    container
                    alignItems="flex-end"
                    gap={1}
                    className={styles.businessInfo}
                >
                    <CustomGrid
                        item
                        alignItems="center"
                        className={styles.templateParticipant}
                    >
                        <PeopleIcon width="22px" height="22px" />
                        <CustomTypography
                            variant="body2"
                            color="colors.black.primary"
                        >
                            {template.maxParticipants}
                        </CustomTypography>
                    </CustomGrid>
                    <ConditionalRender condition={Boolean(template.type)}>
                        <CustomGrid
                            item
                            alignItems="center"
                            className={clsx(styles.templatePayment, {
                                [styles.paid]: Boolean(template.priceInCents),
                            })}
                        >
                            <PaymentIcon width="22px" height="22px" />
                            <CustomTypography
                                variant="body2"
                                color={
                                    template.priceInCents
                                        ? 'colors.blue.primary'
                                        : 'colors.green.primary'
                                }
                            >
                                {template.priceInCents
                                    ? template.priceInCents / 100
                                    : template.type}
                            </CustomTypography>
                        </CustomGrid>
                    </ConditionalRender>
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
});

ProfileTemplateItem.displayName = 'ProfileTemplateItem';

export { ProfileTemplateItem };
