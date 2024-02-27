import {
    setTranscriptionParticipant,
    setTranscriptionResult,
} from '../../../transcription/model';

export const handleReceiveTranscriptionMessage = ({
    message,
}: {
    message: any;
}) => {
    setTranscriptionResult(message.transcription);
    setTranscriptionParticipant(message.participant);
};
