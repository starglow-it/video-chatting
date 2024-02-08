import { memo } from 'react';
import { Fade } from '@mui/material';
import clsx from 'clsx';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// components
import { TemplateParticipants } from '@components/Templates/TemplateParticipants/TemplateParticipants';
import { TemplatePaymentType } from '@components/Templates/TemplatePaymentType/TemplatePaymentType';
import { TemplateInfo } from '@components/Templates/TemplateInfo/TemplateInfo';

// types
import { TemplateMainInfoProps } from '@components/Templates/TemplateMainInfo/types';

// styles
import styles from './TemplateMainInfo.module.scss';

const Component = ({
    show,
    name,
    description,
    maxParticipants,
    type,
    priceInCents,
    isNeedToShowBusinessInfo = true,
    isPublic,
    isCommonTemplate,
    authorRole,
    authorThumbnail,
    authorName,
}: TemplateMainInfoProps) => {
    const { isMobile } = useBrowserDetect();

    return (
        <Fade in={show}>
            <CustomGrid className={clsx(styles.templateInfo, { [styles.mobile]: isMobile })} display='grid'>
                <TemplateInfo
                    className={styles.avatar}
                    name={name}
                    description={description}
                    isPublic={isPublic}
                    isCommonTemplate={isCommonTemplate}
                />
                <CustomBox className={styles.emptySpace} />
                {isNeedToShowBusinessInfo && (
                    <CustomGrid
                        container
                        alignItems="flex-end"
                        gap={1}
                        className={styles.businessInfo}
                    >
                        <TemplateParticipants
                            number={maxParticipants}
                            authorRole={authorRole}
                            authorThumbnail={authorThumbnail}
                            authorName={authorName}
                        />
                        <ConditionalRender condition={Boolean(type)}>
                            <TemplatePaymentType
                                type={type}
                                priceInCents={priceInCents}
                            />
                        </ConditionalRender>
                    </CustomGrid>
                )}
            </CustomGrid>
        </Fade>
    );
}

export const TemplateMainInfo = memo<TemplateMainInfoProps>(Component);
