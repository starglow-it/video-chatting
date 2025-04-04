import {
    $isThereNewTranscriptionMessage,
    $transcriptionParticipant,
    $transcriptionParticipantGuest,
    $transcriptionQueue,
    $transcriptionResults,
    $transcriptionResultsGuest,
    $transcriptionsStore,
    setTranscriptionParticipant,
    setTranscriptionParticipantGuest,
    setTranscriptionQueue,
    setTranscriptionResult,
    setTranscriptionResultGuest,
    setTranscriptionsEvent
} from './model';
import { resetRoomStores } from '../../root';

$transcriptionResults
    .on(setTranscriptionResult, (state, data) => data)
    .reset(resetRoomStores);

$transcriptionParticipant
    .on(setTranscriptionParticipant, (state, data) => data)
    .reset(resetRoomStores);

$transcriptionResultsGuest
    .on(setTranscriptionResultGuest, (state, data) => data)
    .reset(resetRoomStores);

$transcriptionParticipantGuest
    .on(setTranscriptionParticipantGuest, (state, data) => data)
    .reset(resetRoomStores);

$transcriptionQueue
    .on(setTranscriptionQueue, (state, data) => data)
    .reset(resetRoomStores);

$transcriptionsStore
    .on(setTranscriptionsEvent, (state, data) => data)
    .reset(resetRoomStores);

$isThereNewTranscriptionMessage
    .on(setTranscriptionQueue, () => Date.now())
    .reset(resetRoomStores);
