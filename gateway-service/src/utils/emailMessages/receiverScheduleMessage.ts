export const receiverScheduleMessage = ({
  templateName,
  senderFullName,
  startAt,
  endAt,
  comment,
  meetingLink,
}: {
  senderFullName: string;
  templateName: string;
  startAt: string;
  endAt: string;
  comment?: string;
  meetingLink?: string;
}): string => {
  const commentString = comment ? `<br> Comment: ${comment}` : '';
  const meetingLinkString = meetingLink
    ? `<br> Meeting Link: ${meetingLink}`
    : '';

  return `${senderFullName} scheduled meeting with you. <br> Template ${templateName} <br> Starts: ${startAt} <br> Ends: ${endAt} ${commentString} ${meetingLinkString}`;
};
