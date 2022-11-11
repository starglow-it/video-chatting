import React from 'react';

export type CustomSearchProps = {
    Icon?: JSX.Element;
    placeholder: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    value: string;
    className: string;
};
