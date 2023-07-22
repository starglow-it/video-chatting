import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MonitoringService } from './monitoring.service';
import { MonitoringEvent } from 'shared-types';
import * as moment from 'moment';

export type MandrillMsg = {
    ts: number,
    subject: string,
    email: string,
    sender: string,
    tags: string[],
    opens?: unknown[],
    clicks?: unknown[],
    state: string,
    reject?: string,
    metadata: Object,
    _id: string,
    _version: string
}

export type MandrillWebhookEvents = Array<Object & {
    event: string;
    _id: string;
    ts: number;
    msg: MandrillMsg;
}>

@Controller('monitoring')
export class MonitoringController {
    constructor(private readonly monitoringService: MonitoringService) { }

    @Post('/mandrill')
    async mandrillCallback(@Req() req: Request, @Res() res: Response) {
        const events = JSON.parse(req.body['mandrill_events']) as MandrillWebhookEvents;
        const now = moment();
        const promiseArr = events.map(async e => {
            try {
                if (e.event !== 'send') return;
                const m = await this.monitoringService.getMonitoring({
                    event: MonitoringEvent.SendEmail,
                    eventId: e._id
                });
                if (!m) return;
                const processTime = now.diff(m.createdAt, 'millisecond');
                await this.monitoringService.updateMonitoring({
                    id: m.id,
                    metadata: e,
                    processTime
                });
            }
            catch (err) {
                console.log('err', err);
                return;
            }
        });
        await Promise.all(promiseArr);
        res.sendStatus(201);
        return;
    }

}