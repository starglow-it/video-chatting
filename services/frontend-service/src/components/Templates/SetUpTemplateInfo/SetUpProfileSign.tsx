import React, { memo } from 'react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { ChooseSignBoard } from '@components/Templates/ChooseSignBoard/ChooseSignBoard';

const Component = () => (
    <CustomScroll>
        <CustomGrid container direction="column" gap={1.75}>
            <CustomTypography
                nameSpace="templates"
                translation="setUpSpace.customizeSign"
                variant="h2bold"
            />
            <ChooseSignBoard formKey="signBoard" optionWidth={156} optionHeight={108} />
        </CustomGrid>
    </CustomScroll>
);

export const SetUpProfileSign = memo(Component);
