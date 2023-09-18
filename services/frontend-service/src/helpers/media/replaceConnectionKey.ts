export const replaceConnectionKey = ({
    userId,
    connectionId,
}: {
    userId: string;
    connectionId: string;
}) =>
    connectionId
        .split('_')
        .map((item, index) => (index === 0 ? userId : item))
        .join('_');
