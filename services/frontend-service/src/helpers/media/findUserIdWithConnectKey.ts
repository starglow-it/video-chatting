export const matchConnectionKey = ({
    userId,
    connectionId,
}: {
    userId: string;
    connectionId: string;
}) => connectionId.split('_').find(item => item === userId);
