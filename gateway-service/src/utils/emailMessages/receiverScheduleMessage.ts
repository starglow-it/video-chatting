export const receiverScheduleMessage = ({
  templateName,
  senderFullName,
  startAt,
  endAt,
}: {
  senderFullName: string;
  templateName: string;
  startAt: string;
  endAt: string;
}): string => `
${senderFullName} scheduled meeting with you. \n Template ${templateName}
Starts: ${startAt}
Ends: ${endAt}
`;
