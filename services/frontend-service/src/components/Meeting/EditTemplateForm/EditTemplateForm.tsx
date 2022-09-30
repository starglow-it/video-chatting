import React, { memo, useCallback, useState } from 'react';

// custom
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomAccordion } from '@library/custom/CustomAccordion/CustomAccordion';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

// icons
import { CustomLinkIcon } from '@library/icons/CustomLinkIcon';
import { EditIcon } from '@library/icons/EditIcon';
import { PersonIcon } from '@library/icons/PersonIcon';
import { MoneyIcon } from '@library/icons/MoneyIcon';
import { Socials } from '@components/Socials/Socials';
import { SignBoardIcon } from '@library/icons/SignBoardIcon';

// components
import { EditTemplatePersonalInfo } from '@components/Meeting/EditTemplatePersonalInfo/EditTemplatePersonalInfo';
import { EditTemplateCompanyInfo } from '@components/Meeting/EditTemplateCompanyInfo/EditTemplateCompanyInfo';
import { EditMeetingLink } from '@components/Meeting/EditMeetingLink/EditMeetingLink';
import { ChooseSignBoard } from '@components/Templates/ChooseSignBoard/ChooseSignBoard';

// styles
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
                            nameSpace="meeting"
                            translation="templates.personal"
                        >
                            <EditTemplatePersonalInfo />
                        </CustomAccordion>
                        <CustomAccordion
                            AccordionIcon={<MoneyIcon width="24px" height="24px" />}
                            currentAccordionId={currentAccordionId}
                            accordionId="company"
                            onChange={handleChangeAccordion}
                            nameSpace="meeting"
                            translation="templates.company"
                        >
                            <EditTemplateCompanyInfo />
                        </CustomAccordion>
                        <CustomAccordion
                            AccordionIcon={<CustomLinkIcon width="24px" height="24px" />}
                            currentAccordionId={currentAccordionId}
                            accordionId="links"
                            onChange={handleChangeAccordion}
                            nameSpace="meeting"
                            translation="templates.links"
                        >
                            <Socials buttonClassName={styles.socialBtn} />
                        </CustomAccordion>
                        <CustomAccordion
                            AccordionIcon={<SignBoardIcon width="24px" height="24px" />}
                            currentAccordionId={currentAccordionId}
                            accordionId="signboard"
                            onChange={handleChangeAccordion}
                            nameSpace="meeting"
                            translation="templates.signBoard"
                        >
                            <ChooseSignBoard
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
                nameSpace="meeting"
                translation="templates.buttons.saveChanges"
            />
        </CustomGrid>
    );
};

export const EditTemplateForm = memo(Component);
