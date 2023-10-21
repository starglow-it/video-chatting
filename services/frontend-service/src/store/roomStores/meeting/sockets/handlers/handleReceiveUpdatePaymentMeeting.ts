import { receivePaymentMeetingEvent } from '../../meetingPayment/model';
import { SendUpdatePaymentsMeetingRespone } from '../types';

export const handleReceiveUpdatePaymentMeeting = (
    data: SendUpdatePaymentsMeetingRespone,
) => {
    receivePaymentMeetingEvent(data);
};
