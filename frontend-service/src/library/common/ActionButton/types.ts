import React from 'react';

export type ActionButtonProps = {
    onAction?: () => void;
    Icon: React.ReactElement;
    variant?: 'danger' | 'decline' | 'accept';
};
