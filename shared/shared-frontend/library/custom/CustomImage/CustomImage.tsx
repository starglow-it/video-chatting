import React, { memo } from 'react';
import Image from 'next/image';

// types
import { CustomImageProps } from './CustomImage.types';

const Component = ({ loading = 'eager', ...props }: CustomImageProps) => (
    <Image loading={loading} objectFit="cover" layout="fixed" width="100%" height="100%" {...props} />
);

const CustomImage = memo(Component);

export default CustomImage;
