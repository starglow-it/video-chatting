export type SendOfferPayload = {
  type: string;
  sdp: string;
  userId: string;
  connectionId: string;
  socketId: string;
};

export type SendAnswerPayload = {
  type: string;
  sdp: string;
  userId: string;
  connectionId: string;
  socketId: string;
};

export type SendIceCandidatePayload = {
  userId: string;
  connectionId: string;
  candidate: unknown;
  socketId: string;
};

export type SendDevicesPermissionsPayload = {
  userId: string;
  audio: boolean;
  video: boolean;
};
