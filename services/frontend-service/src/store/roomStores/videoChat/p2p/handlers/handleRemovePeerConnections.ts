import { ConnectionsStore } from '../../types';

export const handleRemovePeerConnections = async (connections: ConnectionsStore) => {
    const closeConnectionsPromise = Object.entries(connections).map(
        async ([connectionId, connection]) => {
            await connection.connection.release();
            return connectionId;
        },
    );

    return Promise.all(closeConnectionsPromise);
};
