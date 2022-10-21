import React, { memo } from 'react';

import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const PeopleIcon = memo(({ width, height, className }: CommonIconProps) => (
    <SvgIconWrapper
        width={width}
        height={height}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.1142 17.895C17.5573 17.895 19.6707 18.9715 20.6735 20.5354C21.0808 21.1705 21.3507 22.1362 21.4833 23.4804C21.5612 24.2705 20.9838 24.9742 20.1937 25.0521L20.0526 25.0591H6.43736C5.64339 25.0591 4.99976 24.4154 4.99976 23.6214C4.99976 23.5699 5.00253 23.5184 5.00805 23.4672C5.16244 22.0366 5.44832 21.04 5.86569 20.4293C6.87638 18.9507 8.93398 17.9326 13.1142 17.895ZM20.2003 15.3206C24.0086 15.3206 25.8201 16.2433 26.6797 17.5838C27.0288 18.1282 27.2602 18.9559 27.3738 20.108C27.4406 20.7853 26.9457 21.3885 26.2684 21.4552L26.208 21.4597L22.813 21.4595C22.6314 20.7504 22.3848 20.149 22.0617 19.6452C21.1182 18.1739 19.6009 17.1925 17.4203 16.6776C17.7973 16.306 18.1249 15.8845 18.3927 15.4239C18.9346 15.3614 19.5362 15.3266 20.2003 15.3206ZM13.2347 8.1193C15.6166 8.1193 17.5475 10.0502 17.5475 12.4321C17.5475 14.814 15.6166 16.745 13.2347 16.745C10.8528 16.745 8.92185 14.814 8.92185 12.4321C8.92185 10.0502 10.8528 8.1193 13.2347 8.1193ZM20.3035 6.94141C22.3452 6.94141 24.0003 8.59648 24.0003 10.6381C24.0003 12.6798 22.3452 14.3348 20.3035 14.3348C19.8307 14.3348 19.3785 14.246 18.9629 14.0842C19.1156 13.5598 19.1966 13.0054 19.1966 12.4321C19.1966 10.8023 18.5426 9.32523 17.4827 8.24901C18.1606 7.44912 19.1728 6.94141 20.3035 6.94141Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { PeopleIcon };
