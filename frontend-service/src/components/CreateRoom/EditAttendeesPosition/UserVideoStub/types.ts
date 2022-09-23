import { ParticipantPosition } from '@containers/CreateRoomContainer/types';

export type UserVideoStubProps = {
    stubId: string;
    index: number;
    position: { top: number; left: number };
    onPositionChange: (data: ParticipantPosition) => void;
};
