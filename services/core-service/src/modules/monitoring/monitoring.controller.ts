import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MonitoringService } from './monitoring.service';
import { CoreBrokerPatterns } from 'shared-const';
import { CreateMonitoringPayload, DeleteMonitoringPayload, GetMonitoringsPayload, UpdateMonitoringPayload } from 'shared-types';
import { withTransaction } from 'src/helpers/mongo/withTransaction';
import { plainToInstance } from 'class-transformer';
import { MonitoringDto } from 'src/dtos/monitoring.dto';

@Controller('monitoring')
export class MonitoringController {
    constructor(
        @InjectConnection() private connection: Connection,
        private monitoringService: MonitoringService
    ) { }

    @MessagePattern({ cmd: CoreBrokerPatterns.GetMonitorings })
    async getMonitorings(@Payload() payload: GetMonitoringsPayload) {
        return withTransaction(this.connection, async () => {
            try {
                const { event, filter: { sortProp, atTime, limit = 10, skip = 0 } } = payload;

                const ms = await this.monitoringService.find({
                    query: {
                        event,
                        updatedAt: {
                            $gte: atTime
                        }
                    },
                    options: {
                        sort: {
                            [sortProp]: -1
                        },
                        limit,
                        skip: skip * limit
                    },
                });

                const msPlain = plainToInstance(MonitoringDto, ms,
                    {
                        excludeExtraneousValues: true,
                        enableImplicitConversion: true,
                    }
                );

                const msCount = await this.monitoringService.count({
                    event,
                    updatedAt: {
                        $gte: atTime
                    }
                });

                return {
                    list: msPlain,
                    count: msCount
                };
            }
            catch (err) {
                console.log(err);
                return;
            }
        });
    }

    @MessagePattern({ cmd: CoreBrokerPatterns.CreateMonitoring })
    async createMonitoring(@Payload() payload: CreateMonitoringPayload) {
        return withTransaction(this.connection, async (session) => {
            const { event } = payload;
            try {
                await this.monitoringService.create({
                    data: {
                        event
                    },
                    session
                });
            }
            catch (err) {
                console.log(err);
                return;
            }
        });
    }

    @MessagePattern({ cmd: CoreBrokerPatterns.UpdateMonitoring })
    async updateMonitoring(@Payload() payload: UpdateMonitoringPayload) {
        return withTransaction(this.connection, async (session) => {
            const { id, processTime } = payload;
            try {
                await this.monitoringService.findOneAndUpdate({
                    query: {
                        _id: id
                    },
                    data: {
                        processTime
                    },
                    session
                });
                return;
            }
            catch (err) {
                console.log(err);
                return;
            }
        });
    }

    @MessagePattern({ cmd: CoreBrokerPatterns.DeleteMonitorings })
    async deleteMonitoring(@Payload() payload: DeleteMonitoringPayload) {
        return withTransaction(this.connection, async session => {
            const { atTime } = payload;
            await this.monitoringService.delete({
                query: {
                    updatedAt: {
                        $gte: atTime
                    }
                },
                session
            })
        });
    }

}