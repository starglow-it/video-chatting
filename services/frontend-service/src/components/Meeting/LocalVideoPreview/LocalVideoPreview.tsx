import React, { memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { LocalVideoMock } from '@components/MockComponents/LocalVideoMock/LocalVideoMock';
import { useStore } from 'effector-react';
import { $profileStore } from '../../../store';

const LocalVideoPreview = memo(() => {
    const profile = useStore($profileStore);

    const { control } = useFormContext();

    const fullName = useWatch({
        control,
        name: 'fullName',
    });

    return <LocalVideoMock userName={fullName} userProfileAvatar={profile?.profileAvatar?.url} />;
});

export { LocalVideoPreview };
