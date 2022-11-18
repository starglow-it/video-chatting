import React, { memo, useCallback, useState } from 'react';

// custom
import { CustomButton } from 'shared-frontend/library';
import { CustomGrid } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

// icons
import { CustomLinkIcon } from 'shared-frontend/icons';
import { EditIcon } from 'shared-frontend/icons';
import { PersonIcon } from 'shared-frontend/icons';
import { MoneyIcon } from 'shared-frontend/icons';
import { Socials } from '@components/Socials/Socials';
import { SignBoardIcon } from 'shared-frontend/icons';

// components
import { EditTemplatePersonalInfo } from '@components/Meeting/EditTemplatePersonalInfo/EditTemplatePersonalInfo';
import { EditTemplateCompanyInfo } from '@components/Meeting/EditTemplateCompanyInfo/EditTemplateCompanyInfo';
import { EditMeetingLink } from '@components/Meeting/EditMeetingLink/EditMeetingLink';
import { ChooseSignBoard } from '@components/Templates/ChooseSignBoard/ChooseSignBoard';

// styles
import { Translation } from '@library/common/Translation/Translation';
import { CustomAccordion } from 'shared-frontend';
import styles from './EditTemplateForm.module.scss';

const Component: React.FunctionComponent<{ onCancel: () => void }> = () => {
    const [currentAccordionId, setCurrentAccordionId] = useState('');

    const handleChangeAccordion = useCallback(accordionId => {
        setCurrentAccordionId(prev => (prev === accordionId ? '' : accordionId));
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            flex="1"
            wrap="nowrap"
            alignItems="stretch"
            gap={2.5}
            className={styles.editTemplateWrapper}
        >
            <CustomGrid container alignItems="center">
                <EditIcon width="24px" height="24px" className={styles.editIcon} />
                <CustomTypography
                    color="colors.white.primary"
                    variant="h4bold"
                    nameSpace="meeting"
                    translation="templates.editTemplate"
                />
            </CustomGrid>
            <CustomGrid item flex="1 1 auto" className={styles.scrollWrapper}>
                <CustomScroll>
                    <CustomGrid
                        container
                        direction="column"
                        gap={2}
                        wrap="nowrap"
                        className={styles.formContent}
                    >
                        <EditMeetingLink />
                        <CustomAccordion
                            AccordionIcon={<PersonIcon width="24px" height="24px" />}
                            currentAccordionId={currentAccordionId}
                            accordionId="personal"
                            onChange={handleChangeAccordion}
                            label={
                                <Translation nameSpace="meeting" translation="templates.personal" />
                            }
                        >
                            <EditTemplatePersonalInfo />
                        </CustomAccordion>
                        <CustomAccordion
                            AccordionIcon={<MoneyIcon width="24px" height="24px" />}
                            currentAccordionId={currentAccordionId}
                            accordionId="company"
                            onChange={handleChangeAccordion}
                            label={
                                <Translation nameSpace="meeting" translation="templates.company" />
                            }
                        >
                            <EditTemplateCompanyInfo />
                        </CustomAccordion>
                        <CustomAccordion
                            AccordionIcon={<CustomLinkIcon width="24px" height="24px" />}
                            currentAccordionId={currentAccordionId}
                            accordionId="links"
                            onChange={handleChangeAccordion}
                            label={
                                <Translation nameSpace="meeting" translation="templates.links" />
                            }
                        >
                            <Socials buttonClassName={styles.socialBtn} />
                        </CustomAccordion>
                        <CustomAccordion
                            AccordionIcon={<SignBoardIcon width="24px" height="24px" />}
                            currentAccordionId={currentAccordionId}
                            accordionId="signboard"
                            onChange={handleChangeAccordion}
                            label={
                                <Translation
                                    nameSpace="meeting"
                                    translation="templates.signBoard"
                                />
                            }
                        >
                            <ChooseSignBoard
                                key={currentAccordionId}
                                formKey="signBoard"
                                optionWidth={145}
                                optionHeight={98}
                            />
                        </CustomAccordion>
                    </CustomGrid>
                </CustomScroll>
            </CustomGrid>
            <CustomButton
                className={styles.saveBtn}
                type="submit"
                label={
                    <Translation nameSpace="meeting" translation="templates.buttons.saveChanges" />
                }
            />
        </CustomGrid>
    );
};

export const EditTemplateForm = memo(Component);
