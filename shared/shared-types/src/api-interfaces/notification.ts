export type MessagesSendResponse = MessagesSendSuccessResponse | MessagesSendRejectResponse;
interface MessagesSendResponseBase {
    email: string;
    status: SendingStatus;
    reject_reason?: RejectReason | null;
    _id: string;
}
interface MessagesSendSuccessResponse extends MessagesSendResponseBase {
    status: Exclude<SendingStatus, 'rejected'>;
}
type SendingStatus = 'sent' | 'queued' | 'scheduled' | 'rejected' | 'invalid';
interface MessagesSendRejectResponse extends MessagesSendResponseBase {
    status: 'rejected';
    reject_reason: RejectReason;
}
type RejectReason =
    | 'hard-bounce'
    | 'soft-bounce'
    | 'spam'
    | 'unsub'
    | 'custom'
    | 'invalid-sender'
    | 'invalid'
    | 'test-mode-limit'
    | 'unsigned'
    | 'rule';