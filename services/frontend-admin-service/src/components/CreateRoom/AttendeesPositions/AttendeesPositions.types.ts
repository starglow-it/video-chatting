export type AttendeesPositionsProps = {
    onNextStep: () => void;
    onPreviousStep: () => void;
}

export type ParticipantPosition = {
    id: string;
    top: number;
    left: number;
};