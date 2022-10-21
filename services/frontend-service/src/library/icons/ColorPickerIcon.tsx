import { CommonIconProps } from '@library/types';
import { memo } from 'react';
import { SvgIconWrapper } from './SvgIconWrapper';

const Icon = ({ width, height, className, onClick }: CommonIconProps) => (
    <SvgIconWrapper
        onClick={onClick}
        className={className}
        width={width}
        height={height}
        viewBox="0 0 20 20"
        fill="none"
    >
        <path d="M16.6667 11.6667C16.59 11.7201 15 13.4026 15 14.5834C15 15.8284 15.7908 16.6234 16.6667 16.6667C17.4217 16.7034 18.3333 15.9242 18.3333 14.5834C18.3333 13.3334 16.7433 11.7201 16.6667 11.6667ZM7.98833 16.6667C8.30333 16.9817 8.72167 17.1551 9.16667 17.1551C9.61167 17.1551 10.03 16.9817 10.345 16.6667L16.1783 10.8334L15.5892 10.2442L9.16667 3.82172L7.845 2.50006C7.51961 2.17467 6.99206 2.17467 6.66667 2.50006C6.34128 2.82544 6.34128 3.353 6.66667 3.67839L7.98833 5.00006L3.33333 9.65506C3.01833 9.97006 2.845 10.3884 2.845 10.8334C2.845 11.2784 3.01833 11.6967 3.33333 12.0117L7.98833 16.6667ZM9.16667 6.17839L13.8217 10.8334H4.51167L9.16667 6.17839Z" fill="#0F0F10"/>
    </SvgIconWrapper>
);

export const ColorPickerIcon = memo<CommonIconProps>(Icon);
