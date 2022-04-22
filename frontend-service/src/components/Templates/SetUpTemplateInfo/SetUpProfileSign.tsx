import React, { memo } from 'react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { ChooseSignBoard } from "@components/Templates/ChooseSignBoard/ChooseSignBoard";

const Component: React.FunctionComponent = () => (
    <CustomGrid container direction="column" gap={1.75}>
        <CustomTypography
            nameSpace="templates"
            translation="setUpSpace.customizeSign"
            variant="h2bold"
        />
        <ChooseSignBoard optionWidth={160} optionHeight={108} />
    </CustomGrid>
);

export const SetUpProfileSign = memo(Component);
