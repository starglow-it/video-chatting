import { ParticipantPosition } from 'shared-frontend/types';

export type UserVideoStubProps = {
    stubId: string;
    index: number;
    isDraggable?: boolean;
    position: { top: number; left: number };
    onPositionChange?: (data: ParticipantPosition) => void;
};
