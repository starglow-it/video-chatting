import { receivePaymentMeetingEvent } from '../../meetingPayment/model';
import { SendUpdatePaymentsMeetingRespone } from '../types';

export const handleReceiveUpdatePaymentMeeting = (
    data: SendUpdatePaymentsMeetingRespone,
) => {
    console.log('#Duy Phan console', data)
    receivePaymentMeetingEvent(data);
};
