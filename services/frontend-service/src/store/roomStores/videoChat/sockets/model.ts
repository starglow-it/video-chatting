import { createMeetingSocketEvent } from '../../meetingSocket/model';
import { VideoChatSocketEmitters } from '../../../../const/socketEvents/emitters';
import {
    AnswerExchangePayload,
    DevicesExchangePayload,
    IceCandidatesExchangePayload,
    OfferExchangePayload,
} from '../types';

export const sendOfferSocketEvent = createMeetingSocketEvent<OfferExchangePayload, void>(
    VideoChatSocketEmitters.SendOffer,
);

export const sendAnswerSocketEvent = createMeetingSocketEvent<AnswerExchangePayload, void>(
    VideoChatSocketEmitters.SendAnswer,
);

export const sendIceCandidateSocketEvent = createMeetingSocketEvent<
    IceCandidatesExchangePayload,
    void
>(VideoChatSocketEmitters.SendIceCandidate);

export const sendDevicesPermissionSocketEvent = createMeetingSocketEvent<
    DevicesExchangePayload,
    void
>(VideoChatSocketEmitters.SendDevicesPermission);
