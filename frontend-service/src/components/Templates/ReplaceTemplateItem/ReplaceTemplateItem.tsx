import React, { memo } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import { Fade } from '@mui/material';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CheckIcon } from '@library/icons/CheckIcon';
import styles from './ReplaceTemplateItem.module.scss';

// stores
import { $deleteProfileTemplateId } from '../../../store';

// types
import { ReplaceTemplateItemProps } from './types';

const Component = ({ template, onChooseTemplate }: ReplaceTemplateItemProps) => {
    const deleteTemplateId = useStore($deleteProfileTemplateId);

    const previewImage = (template?.previewUrls || []).find(preview => preview.resolution === 240);

    const isChosenForReplace = template.id === deleteTemplateId;

    const handleChooseTemplate = () => {
        onChooseTemplate?.(template.id);
    };

    return (
        <CustomGrid
            className={clsx(styles.templateContent, { [styles.active]: isChosenForReplace })}
            container
            justifyContent="center"
            alignItems="center"
            onClick={handleChooseTemplate}
        >
            <ConditionalRender condition={Boolean(previewImage?.url)}>
                <Image src={previewImage?.url} width="334px" height="190px" />
            </ConditionalRender>
            <Fade in={isChosenForReplace}>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    className={styles.checkIcon}
                >
                    <CheckIcon width="18px" height="18px" />
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
};

export const ReplaceTemplateItem = memo(Component);
