import { ConnectionsStore } from '../../types';

export const handleRemovePeerConnections = async (connections: ConnectionsStore) => {
    const closeConnectionsPromise = Object.entries(connections).map(
        async ([userId, connection]) => {
            await connection.connection.release();
            return userId;
        },
    );

    return Promise.all(closeConnectionsPromise);
};
