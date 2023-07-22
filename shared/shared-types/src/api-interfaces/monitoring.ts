
export enum MonitoringEvent {
    SendEmail = 'send_email'
}

export interface IMonitoring {
    id: string;
    event: MonitoringEvent;
    eventId: string;
    metadata: Object;
    processTime: number;
    createdAt?: Date;
    updatedAt?: Date;
}