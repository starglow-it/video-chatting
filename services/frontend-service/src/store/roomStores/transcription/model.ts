import { transcriptionDomain } from '../../domains';

const defaultTranscriptionText = '';
const defaultTranscriptionParticipant = 'Host';
const defaultTranscriptionQueue: string[] = [];

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

export const $transcriptionQueue = transcriptionDomain.createStore<string[]>(
    defaultTranscriptionQueue,
);

export const setTranscriptionQueue = transcriptionDomain.createEvent<string[]>(
    'setTranscriptionQueue',
);

export const $isThereNewTranscriptionMessage =
    transcriptionDomain.createStore<number>(0);
