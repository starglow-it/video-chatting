export const receiverScheduleMessage = ({
  templateName,
  senderFullName,
  startAt,
  endAt,
  comment,
}: {
  senderFullName: string;
  templateName: string;
  startAt: string;
  endAt: string;
  comment: string;
}): string =>
  `${senderFullName} scheduled meeting with you. <br> Template ${templateName} <br> Starts: ${startAt} <br> Ends: ${endAt} <br> Comment: ${comment}`;
