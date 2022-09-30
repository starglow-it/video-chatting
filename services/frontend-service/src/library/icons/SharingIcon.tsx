import React, { memo } from 'react';
import { CommonIconProps } from '@library/types';
import { SvgIconWrapper } from './SvgIconWrapper';

const SharingIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 32 32" fill="none" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.29395 13.192C6.29395 10.981 6.29395 9.87555 6.73105 9.03409C7.09939 8.32501 7.67755 7.74685 8.38663 7.37851C9.22809 6.94141 10.3336 6.94141 12.5445 6.94141H19.4551C21.6661 6.94141 22.7716 6.94141 23.613 7.37851C24.3221 7.74685 24.9003 8.32501 25.2686 9.03409C25.7057 9.87555 25.7057 10.981 25.7057 13.192V16.2202C25.7057 18.4312 25.7057 19.5367 25.2686 20.3781C24.9003 21.0872 24.3221 21.6654 23.613 22.0337C22.7716 22.4708 21.6661 22.4708 19.4551 22.4708H12.5445C10.3336 22.4708 9.22809 22.4708 8.38663 22.0337C7.67755 21.6654 7.09939 21.0872 6.73105 20.3781C6.29395 19.5367 6.29395 18.4312 6.29395 16.2202V13.192ZM17.1 10.1767C17.188 10.1767 17.2726 10.21 17.3358 10.2696L21.0728 13.7872C21.2075 13.9141 21.2112 14.1233 21.081 14.2546L17.3358 17.7802C17.2011 17.9071 16.9862 17.9035 16.856 17.7723C16.7948 17.7106 16.7607 17.6283 16.7607 17.5426L16.7604 16.0166L15.4279 16.0169C14.4871 16.0169 13.6011 16.2519 12.8257 16.6663C12.4249 16.8806 11.9532 17.2706 11.4107 17.8365C11.2828 17.9699 11.0681 17.977 10.9311 17.8525C10.8623 17.7899 10.8232 17.7022 10.8234 17.6105L10.8236 17.3971C10.8236 14.3482 13.2973 11.8765 16.3488 11.8765L16.7604 11.8762L16.7607 10.5072C16.7607 10.3247 16.9126 10.1767 17.1 10.1767Z"
            fill="currentColor"
        />
        <path
            d="M11.7939 23.1179C11.2579 23.1179 10.8234 23.5524 10.8234 24.0885C10.8234 24.6245 11.2579 25.0591 11.7939 25.0591H20.2057C20.7418 25.0591 21.1763 24.6245 21.1763 24.0885C21.1763 23.5524 20.7418 23.1179 20.2057 23.1179H11.7939Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { SharingIcon };
