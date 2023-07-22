import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MonitoringService } from './monitoring.service';
import { MonitoringEvent } from 'shared-types';
import * as moment from 'moment';
import { GetMonitoringParam } from '../../dtos/params/get-monitoring.param';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMonitoringQueryDto } from '../../dtos/query/GetMonitoringQuery.dto';
import { MonitoringDto } from '../../dtos/response/monitoring.dto';
import { DeleteMonitoringRequestDto } from '../../dtos/requests/delete-monitoring.request';

type MandrillMsg = {
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

type MandrillWebhookEvents = Array<Object & {
    event: string;
    _id: string;
    ts: number;
    msg: MandrillMsg;
}>

@ApiTags('Monitoring')
@Controller('monitoring')
export class MonitoringController {
    constructor(private readonly monitoringService: MonitoringService) { }

    @Post('/mandrill')
    async handleMandrillCallback(@Req() req: Request, @Res() res: Response) {
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
                    metadata: JSON.stringify(e),
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

    @Get('/:event')
    @ApiOperation({ summary: 'Get Monitoring Records' })
    @ApiOkResponse({
        type: [MonitoringDto],
        description: 'Get Monitoring Records',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    async getMonitorings(
        @Param() params: GetMonitoringParam,
        @Query() queries: GetMonitoringQueryDto
    ) {
        const { event } = params;
        try {
            return await this.monitoringService.getMonitorings({
                event,
                filter: queries
            });
        }
        catch (err) {
            console.log(err);
            return;
        }
    }

    @Delete('/:event')
    async deleteMonitorings(
        @Param() params: GetMonitoringParam,
        @Body() body: DeleteMonitoringRequestDto
    ){
        try{
            return await this.monitoringService.deleteMonitorings({
                event: params.event,
                atTime: body.from
            });
        }
        catch(err){
            console.log(err);
            return;
        }
    }
}