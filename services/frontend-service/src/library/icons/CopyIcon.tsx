import React from 'react';

import { CommonIconProps } from '@library/types';

const Component = ({ width, height, className, onClick }: CommonIconProps) => (
    <svg
        width={width}
        height={height}
        className={className}
        onClick={onClick}
        viewBox="0 0 18 18"
        fill="none"
    >
        <path
            d="M5.46196 6.92935V5.93478H4.59783C4.17406 5.93478 3.76764 6.10312 3.46799 6.40278C3.16834 6.70243 3 7.10884 3 7.53261V12.3016C3 13.0173 3.28429 13.7036 3.79033 14.2097C4.29638 14.7157 4.98272 15 5.69837 15H10.4674C10.8912 15 11.2976 14.8317 11.5972 14.532C11.8969 14.2324 12.0652 13.8259 12.0652 13.4022V12.538H11.0707V13.4022C11.0707 13.5622 11.0071 13.7156 10.894 13.8287C10.7808 13.9419 10.6274 14.0054 10.4674 14.0054H5.69837C5.24649 14.0054 4.81312 13.8259 4.4936 13.5064C4.17407 13.1869 3.99457 12.7535 3.99457 12.3016V7.53261C3.99457 7.37261 4.05812 7.21917 4.17126 7.10604C4.28439 6.99291 4.43783 6.92935 4.59783 6.92935H5.46196Z"
            fill="currentColor"
        />
        <path
            d="M7.10604 4.17126C7.21917 4.05812 7.37261 3.99457 7.53261 3.99457H7.89946C8.03134 3.99457 8.15783 3.94217 8.25109 3.84891C8.34435 3.75566 8.39674 3.62917 8.39674 3.49728C8.39674 3.3654 8.34435 3.23891 8.25109 3.14565C8.15783 3.05239 8.03134 3 7.89946 3H7.53261C7.10884 3 6.70243 3.16834 6.40278 3.46799C6.10312 3.76764 5.93478 4.17406 5.93478 4.59783V4.96467C5.93478 5.09656 5.98717 5.22305 6.08043 5.31631C6.17369 5.40956 6.30018 5.46196 6.43207 5.46196C6.56395 5.46196 6.69044 5.40956 6.7837 5.31631C6.87696 5.22305 6.92935 5.09656 6.92935 4.96467V4.59783C6.92935 4.43783 6.99291 4.28439 7.10604 4.17126Z"
            fill="currentColor"
        />
        <path
            d="M7.10604 10.894C6.99291 10.7808 6.92935 10.6274 6.92935 10.4674V10.1005C6.92935 9.96866 6.87696 9.84217 6.7837 9.74891C6.69044 9.65565 6.56395 9.60326 6.43207 9.60326C6.30018 9.60326 6.17369 9.65565 6.08043 9.74891C5.98717 9.84217 5.93478 9.96866 5.93478 10.1005V10.4674C5.93478 10.8912 6.10312 11.2976 6.40278 11.5972C6.70243 11.8969 7.10884 12.0652 7.53261 12.0652H7.89946C8.03134 12.0652 8.15783 12.0128 8.25109 11.9196C8.34435 11.8263 8.39674 11.6998 8.39674 11.5679C8.39674 11.436 8.34435 11.3096 8.25109 11.2163C8.15783 11.123 8.03134 11.0707 7.89946 11.0707H7.53261C7.37261 11.0707 7.21917 11.0071 7.10604 10.894Z"
            fill="currentColor"
        />
        <path
            d="M6.92935 6.58653C6.92935 6.45464 6.87696 6.32815 6.7837 6.2349C6.69044 6.14164 6.56395 6.08925 6.43207 6.08925C6.30018 6.08925 6.17369 6.14164 6.08043 6.2349C5.98717 6.32815 5.93478 6.45464 5.93478 6.58653V8.47869C5.93478 8.61058 5.98717 8.73706 6.08043 8.83032C6.17369 8.92358 6.30018 8.97597 6.43207 8.97597C6.56395 8.97597 6.69044 8.92358 6.7837 8.83032C6.87696 8.73706 6.92935 8.61058 6.92935 8.47869V6.58653Z"
            fill="currentColor"
        />
        <path
            d="M13.4022 3.99457C13.5622 3.99457 13.7156 4.05812 13.8287 4.17126C13.9419 4.28439 14.0054 4.43783 14.0054 4.59783V4.96467C14.0054 5.09656 14.0578 5.22305 14.1511 5.31631C14.2443 5.40956 14.3708 5.46196 14.5027 5.46196C14.6346 5.46196 14.7611 5.40956 14.8543 5.31631C14.9476 5.22305 15 5.09656 15 4.96467V4.59783C15 4.17406 14.8317 3.76764 14.532 3.46799C14.2324 3.16834 13.8259 3 13.4022 3H13.0353C12.9034 3 12.777 3.05239 12.6837 3.14565C12.5904 3.23891 12.538 3.3654 12.538 3.49728C12.538 3.62917 12.5904 3.75566 12.6837 3.84891C12.777 3.94217 12.9034 3.99457 13.0353 3.99457H13.4022Z"
            fill="currentColor"
        />
        <path
            d="M13.8287 10.894C13.7156 11.0071 13.5622 11.0707 13.4022 11.0707H13.0353C12.9034 11.0707 12.777 11.123 12.6837 11.2163C12.5904 11.3096 12.538 11.436 12.538 11.5679C12.538 11.6998 12.5904 11.8263 12.6837 11.9196C12.777 12.0128 12.9034 12.0652 13.0353 12.0652H13.4022C13.8259 12.0652 14.2324 11.8969 14.532 11.5972C14.8317 11.2976 15 10.8912 15 10.4674V10.1005C15 9.96866 14.9476 9.84217 14.8543 9.74891C14.7611 9.65565 14.6346 9.60326 14.5027 9.60326C14.3708 9.60326 14.2443 9.65565 14.1511 9.74891C14.0578 9.84217 14.0054 9.96866 14.0054 10.1005V10.4674C14.0054 10.6274 13.9419 10.7808 13.8287 10.894Z"
            fill="currentColor"
        />
        <path
            d="M14.5027 6.08925C14.3708 6.08925 14.2443 6.14164 14.1511 6.2349C14.0578 6.32815 14.0054 6.45464 14.0054 6.58653V8.47869C14.0054 8.61058 14.0578 8.73706 14.1511 8.83032C14.2443 8.92358 14.3708 8.97597 14.5027 8.97597C14.6346 8.97597 14.7611 8.92358 14.8543 8.83032C14.9476 8.73706 15 8.61058 15 8.47869V6.58653C15 6.45464 14.9476 6.32815 14.8543 6.2349C14.7611 6.14164 14.6346 6.08925 14.5027 6.08925Z"
            fill="currentColor"
        />
        <path
            d="M9.52131 3C9.38942 3 9.26294 3.05239 9.16968 3.14565C9.07642 3.23891 9.02403 3.3654 9.02403 3.49728C9.02403 3.62917 9.07642 3.75566 9.16968 3.84891C9.26294 3.94217 9.38942 3.99457 9.52131 3.99457H11.4135C11.5454 3.99457 11.6718 3.94217 11.7651 3.84891C11.8584 3.75566 11.9108 3.62917 11.9108 3.49728C11.9108 3.3654 11.8584 3.23891 11.7651 3.14565C11.6718 3.05239 11.5454 3 11.4135 3H9.52131Z"
            fill="currentColor"
        />
        <path
            d="M9.16968 11.2163C9.07642 11.3096 9.02403 11.436 9.02403 11.5679C9.02403 11.6998 9.07642 11.8263 9.16968 11.9196C9.26294 12.0128 9.38942 12.0652 9.52131 12.0652H11.4135C11.5454 12.0652 11.6718 12.0128 11.7651 11.9196C11.8584 11.8263 11.9108 11.6998 11.9108 11.5679C11.9108 11.436 11.8584 11.3096 11.7651 11.2163C11.6718 11.123 11.5454 11.0707 11.4135 11.0707H9.52131C9.38942 11.0707 9.26294 11.123 9.16968 11.2163Z"
            fill="currentColor"
        />
    </svg>
);

export const CopyIcon = React.memo(Component);
