import { IMonitoring } from "../api-interfaces"

export type GetMonitoringsPayload = {
    event: IMonitoring['event'];
    filter: Partial<
        {
            skip: number;
            limit: number;
            sortProp: keyof Omit<IMonitoring, 'id'>;
            atTime: IMonitoring['updatedAt'];
        }>;
}

export type GetMonitoringPayload = {
    event: IMonitoring['event'];
    eventId: IMonitoring['eventId'];
}

export type CreateMonitoringPayload = {
    event: IMonitoring['event'];
    eventId: IMonitoring['eventId'];
}

export type UpdateMonitoringPayload = {
    id: IMonitoring['id'];
    processTime: IMonitoring['processTime'];
    metadata: IMonitoring['metadata'];
}

export type DeleteMonitoringPayload = {
    atTime: IMonitoring['updatedAt']
}