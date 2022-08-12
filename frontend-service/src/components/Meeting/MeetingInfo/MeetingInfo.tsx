import React, { ForwardedRef, forwardRef, memo, useMemo } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { InfoIcon } from '@library/icons/InfoIcon';
import { PeoplesIcon } from '@library/icons/PeoplesIcon';
import { EmailIcon } from '@library/icons/EmailIcon';
import { LanguageIcon } from '@library/icons/LanguageIcon';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { BusinessCategoryItem } from '@components/BusinessCategoryItem/BusinessCategoryItem';

// stores
import { $meetingTemplateStore } from '../../../store';

// styles
import styles from './MeetingInfo.module.scss';

// const
import { SOCIALS_ICONS } from '../../../const/profile/socials';

const Component = (_: unknown, ref: ForwardedRef<HTMLDivElement>) => {
    const meetingTemplate = useStore($meetingTemplateStore);

    const renderLanguages = useMemo(
        () => meetingTemplate.languages.map(language => language.value).join(', '),
        [meetingTemplate.languages],
    );

    const renderBusinessCategories = useMemo(
        () =>
            meetingTemplate.businessCategories.map(category => (
                <BusinessCategoryItem key={category.key} category={category} />
            )),
        [meetingTemplate.businessCategories],
    );

    const socialsLink = useMemo(
        () =>
            meetingTemplate?.socials?.map(social => {
                const Icon = SOCIALS_ICONS[social.key];

                const handleAction = () => {
                    if (social.value) {
                        window.open(social.value, '_blank');
                    }
                };

                return (
                    <CustomTooltip
                        key={social.key}
                        nameSpace="common"
                        translation={`tooltips.${social.key}`}
                    >
                        <ActionButton
                            className={styles.socialBtn}
                            Icon={<Icon width="40px" height="40px" />}
                            onAction={handleAction}
                        />
                    </CustomTooltip>
                );
            }),
        [meetingTemplate.socials],
    );

    return (
        <CustomGrid ref={ref} container direction="column" className={styles.wrapper}>
            <CustomScroll className={styles.scroll}>
                <CustomGrid container alignItems="center" className={styles.header} gap={1.5}>
                    <InfoIcon width="24px" height="24px" />
                    <CustomTypography
                        color="colors.white.primary"
                        variant="h4bold"
                        nameSpace="meeting"
                        translation="meetingInfo.title"
                    />
                </CustomGrid>
                <CustomGrid container gap={4.5} direction="column">
                    <CustomGrid container gap={2} direction="column">
                        <CustomGrid container className={styles.mainInfo} gap={1.5} wrap="nowrap">
                            <ProfileAvatar
                                className={styles.avatar}
                                width="50px"
                                height="50px"
                                src={meetingTemplate?.user?.profileAvatar?.url || ''}
                                userName={meetingTemplate.fullName}
                            />
                            <CustomGrid item container direction="column" flex="1 1 auto">
                                <CustomTypography
                                    variant="body1bold"
                                    color="colors.white.primary"
                                    className={styles.ellips}
                                >
                                    {meetingTemplate.fullName}
                                </CustomTypography>
                                <CustomTypography
                                    variant="body2"
                                    color="colors.white.primary"
                                    className={styles.ellips}
                                >
                                    {meetingTemplate.position}
                                </CustomTypography>
                            </CustomGrid>
                        </CustomGrid>
                        <ConditionalRender condition={Boolean(meetingTemplate.languages?.length)}>
                            <CustomGrid container display="inline-flex" className={styles.language}>
                                <CustomTypography
                                    color="colors.white.primary"
                                    className={styles.text}
                                >
                                    <LanguageIcon
                                        width="24px"
                                        height="24px"
                                        className={styles.icon}
                                    />
                                    Language: {renderLanguages}
                                </CustomTypography>
                            </CustomGrid>
                        </ConditionalRender>
                    </CustomGrid>
                    <CustomGrid container direction="column" gap={2}>
                        <CustomTypography
                            color="colors.white.primary"
                            variant="h4bold"
                            nameSpace="meeting"
                            translation="meetingInfo.company"
                        />
                        <ConditionalRender condition={Boolean(meetingTemplate.companyName)}>
                            <CustomGrid container className={styles.company} gap={1}>
                                <PeoplesIcon width="24px" height="24px" />
                                <CustomTypography
                                    color="colors.white.primary"
                                    className={styles.text}
                                >
                                    {meetingTemplate.companyName}
                                </CustomTypography>
                            </CustomGrid>
                        </ConditionalRender>
                        <ConditionalRender condition={Boolean(meetingTemplate.contactEmail)}>
                            <CustomGrid container className={styles.email} gap={1}>
                                <EmailIcon width="24px" height="24px" />
                                <CustomTypography
                                    color="colors.white.primary"
                                    className={styles.text}
                                >
                                    {meetingTemplate.contactEmail}
                                </CustomTypography>
                            </CustomGrid>
                        </ConditionalRender>
                        <ConditionalRender condition={Boolean(meetingTemplate.description)}>
                            <CustomGrid container className={styles.description} gap={1}>
                                <CustomTypography
                                    color="colors.white.primary"
                                    className={styles.text}
                                >
                                    {meetingTemplate.description}
                                </CustomTypography>
                            </CustomGrid>
                        </ConditionalRender>
                        <ConditionalRender
                            condition={Boolean(meetingTemplate?.businessCategories?.length)}
                        >
                            <CustomGrid container gap={1}>
                                {renderBusinessCategories}
                            </CustomGrid>
                        </ConditionalRender>
                    </CustomGrid>
                    <ConditionalRender condition={Boolean(meetingTemplate?.socials?.length)}>
                        <CustomGrid container direction="column" gap={2}>
                            <CustomTypography
                                color="colors.white.primary"
                                variant="h4bold"
                                nameSpace="meeting"
                                translation="meetingInfo.contacts"
                            />
                            <CustomGrid container gap={1.5}>
                                {socialsLink}
                            </CustomGrid>
                        </CustomGrid>
                    </ConditionalRender>
                </CustomGrid>
            </CustomScroll>
        </CustomGrid>
    );
};

export const MeetingInfo = memo<unknown>(forwardRef<HTMLDivElement, unknown>(Component));
