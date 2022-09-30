import React, { memo } from 'react';
import { SvgIconWrapper } from '@library/icons/SvgIconWrapper';
import { CommonIconProps } from '@library/types';

const Component = ({ width, height, isActive }: CommonIconProps) => {
    if (isActive) {
        return (
            <SvgIconWrapper width={width} height={height} viewBox="0 0 40 40" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.0001 10.8334C13.7428 10.8334 8.44695 14.9457 6.66675 20.6147C8.44695 26.2837 13.7428 30.396 20.0001 30.396C26.2573 30.396 31.5532 26.2837 33.3334 20.6147C31.5532 14.9457 26.2573 10.8334 20.0001 10.8334ZM23.9523 24.5669C25.0005 23.5187 25.5894 22.0971 25.5894 20.6147C25.5894 19.1323 25.0005 17.7106 23.9523 16.6624C22.9041 15.6142 21.4825 15.0254 20.0001 15.0254C18.5177 15.0254 17.096 15.6142 16.0478 16.6624C14.9996 17.7106 14.4108 19.1323 14.4108 20.6147C14.4108 22.0971 14.9996 23.5187 16.0478 24.5669C17.096 25.6151 18.5177 26.204 20.0001 26.204C21.4825 26.204 22.9041 25.6151 23.9523 24.5669ZM21.9762 22.5913C21.4521 23.1154 20.7413 23.4098 20.0001 23.4098C19.2589 23.4098 18.5481 23.1154 18.024 22.5913C17.4999 22.0672 17.2054 21.3564 17.2054 20.6152C17.2054 19.874 17.4999 19.1632 18.024 18.6391C18.5481 18.115 19.2589 17.8205 20.0001 17.8205C20.7413 17.8205 21.4521 18.115 21.9762 18.6391C22.5003 19.1632 22.7948 19.874 22.7948 20.6152C22.7948 21.3564 22.5003 22.0672 21.9762 22.5913Z"
                    fill="currentColor"
                />
            </SvgIconWrapper>
        );
    }

    return (
        <SvgIconWrapper width={width} height={height} viewBox="0 0 40 40" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.2241 9.16668C10.5905 9.1635 10.9434 9.30434 11.207 9.55887H11.2084L13.6956 12.0475C15.6498 11.058 17.81 10.5438 20.0004 10.5468C26.2576 10.5468 31.5535 14.6591 33.3337 20.3281C32.4971 22.9829 30.8877 25.3279 28.7113 27.0632L30.7696 29.1215C31.0241 29.385 31.1649 29.738 31.1618 30.1043C31.1586 30.4707 31.0116 30.8212 30.7526 31.0803C30.4935 31.3393 30.143 31.4863 29.7766 31.4895C29.4103 31.4927 29.0573 31.3518 28.7937 31.0973L9.23116 11.5347C8.97663 11.2712 8.83579 10.9182 8.83897 10.5518C8.84215 10.1854 8.98911 9.83497 9.24819 9.57589C9.50726 9.31682 9.85773 9.16986 10.2241 9.16668ZM17.1619 15.5124L17.161 15.5115V15.5129C17.1613 15.5127 17.1616 15.5125 17.1619 15.5124ZM17.1619 15.5124L19.2766 17.6284C19.7504 17.5026 20.2489 17.5034 20.7223 17.6309C21.1957 17.7583 21.6273 18.0078 21.974 18.3544C22.3207 18.7011 22.5702 19.1327 22.6976 19.6061C22.825 20.0795 22.8258 20.5781 22.7 21.0519L24.8156 23.1674C25.4457 22.0999 25.7031 20.8532 25.5473 19.6234C25.3914 18.3936 24.8311 17.2505 23.9546 16.3739C23.078 15.4973 21.9349 14.937 20.7051 14.7812C19.4756 14.6254 18.2292 14.8826 17.1619 15.5124ZM19.6507 25.9066L23.4291 29.6864C22.3322 29.9631 21.1836 30.1098 20 30.1098C13.7442 30.1098 8.44694 25.9974 6.66675 20.3285C7.21778 18.5775 8.10909 16.9526 9.28953 15.5468L14.4219 20.6792C14.5074 22.0378 15.0858 23.3186 16.0485 24.281C17.0112 25.2435 18.2921 25.8215 19.6507 25.9066Z"
                fill="currentColor"
            />
        </SvgIconWrapper>
    );
};

export const VideoEyeIcon = memo(Component);
