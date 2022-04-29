export const senderScheduleMessage = ({
  fullName,
  templateName,
  startAt,
  endAt,
  comment,
}: {
  fullName: string;
  templateName: string;
  startAt: string;
  endAt: string;
  comment: string;
}): string =>
  `You have scheduled meeting with ${fullName}. <br> Template name ${templateName} <br> Starts: ${startAt} <br> Ends: ${endAt} <br> Comment: ${comment}`;
