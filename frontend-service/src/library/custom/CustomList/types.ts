import { ReactNode } from 'react';

export type CustomListProps = {
    listElements: { key: string; element: ReactNode }[];
};
