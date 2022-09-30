import React from 'react';

export type ChooseFileProps = React.PropsWithChildren<{
    onChoose: (file: File) => void;
    accept: string[];
}>;
