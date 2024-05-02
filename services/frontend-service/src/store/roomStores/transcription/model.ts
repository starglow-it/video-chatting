import { transcriptionDomain } from '../../domains';

const defaultTranscriptionText = '';
const defaultTranscriptionParticipant = 'Host';

type TranscriptionEntry = {
    sender: string;
    message: string;
};

// const defaultTranscriptionQueue: string[] = [];
const defaultTranscriptionQueue: TranscriptionEntry[] = [];

export const $transcriptionResults = transcriptionDomain.createStore<string>(
    defaultTranscriptionText,
);

export const setTranscriptionResult = transcriptionDomain.createEvent<string>(
    'setTranscriptionResult',
);

export const $transcriptionParticipant =
    transcriptionDomain.createStore<string>(defaultTranscriptionParticipant);

export const setTranscriptionParticipant =
    transcriptionDomain.createEvent<string>('setTranscriptionParticipant');

export const $transcriptionResultsGuest =
    transcriptionDomain.createStore<string>(defaultTranscriptionText);

export const setTranscriptionResultGuest =
    transcriptionDomain.createEvent<string>('setTranscriptionResultGuest');

export const $transcriptionParticipantGuest =
    transcriptionDomain.createStore<string>(defaultTranscriptionParticipant);

export const setTranscriptionParticipantGuest =
    transcriptionDomain.createEvent<string>('setTranscriptionParticipantGuest');

// export const $transcriptionQueue = transcriptionDomain.createStore<string[]>(
//     defaultTranscriptionQueue,
// );
export const $transcriptionQueue = transcriptionDomain.createStore<TranscriptionEntry[]>(
    defaultTranscriptionQueue,
);

export const $transcriptionsStore = transcriptionDomain.createStore<string[]>([]);

// export const setTranscriptionQueue = transcriptionDomain.createEvent<string[]>(
//     'setTranscriptionQueue',
// );
export const setTranscriptionQueue = transcriptionDomain.createEvent<TranscriptionEntry[]>(
    'setTranscriptionQueue',
);

export const setTranscriptionsEvent = transcriptionDomain.createEvent<string>(
    'setTranscriptionsEvent',
);

export const $isThereNewTranscriptionMessage =
    transcriptionDomain.createStore<number>(0);
