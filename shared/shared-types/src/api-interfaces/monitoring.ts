
export enum MonitoringEvent {
    SendEmail = 'sendEamil'
}
export interface IMonitoring {
    id: string;
    event: MonitoringEvent;
    processTime: string;
    createdAt?: Date;
    updatedAt?: Date;
}