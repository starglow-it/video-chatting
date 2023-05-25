import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { ConfigClientService } from "../services/config/config.service";
import { isArray } from "util";
import { Collection, Environmens, EnvironmentMigration, MappingKey } from "shared-types";

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationBootstrap {
    private environment: string;
    private models: Readonly<{ [index: string]: Model<any> }>;
    private logger = new Logger(DatabaseService.name);

    constructor(
        @InjectConnection() private connection: Connection,
        private readonly configService: ConfigClientService
    ) { }

    async onModuleInit() {
        this.environment = await this.configService.get('environment');
    }

    async onApplicationBootstrap() {
        try {
            if (this.connection.readyState !== 1) return;
            this.models = this.connection.models;

            await this.syncDataMultipleEnvs();
        }
        catch (err) {
            this.logger.error(err.message);
            return;
        }
    }

    private isAcceptFilter(item: string): boolean {
        return item !== 'id';
    }

    private async getRecords(entities: string[]): Promise<Collection[]> {
        try {
            return (await Promise.all(entities.map(async modelName => {

                const schemaObject = this.models[modelName]?.schema.obj || {};

                const fieldList = Object.keys(schemaObject);

                const filterFields = (fieldList.filter(field => typeof schemaObject[field]['default'] !== 'undefined'));

                const records = await this.models[modelName]?.aggregate([{
                    $match: {
                        $or: this.handleMappingValuesByKeys(fieldList, {
                            $exists: false
                        }).list
                    },
                }, {
                    $set: {
                        missKeys: {
                            $setDifference: [
                                filterFields,
                                {
                                    $map:
                                    {
                                        input: { $objectToArray: "$$ROOT" },
                                        in: "$$this.k"
                                    }
                                },
                            ],
                        },
                    },
                }, {
                    $project: {
                        _id: 1,
                        missKeys: 1
                    }
                }]).exec();
                return {
                    name: modelName,
                    records
                }
            }))) as Collection[];
        }
        catch (err) {
            this.logger.error(err.message);
            return;
        }
    }

    async handleUpdateData(collections: Collection[]) {
        try {
            await Promise.all(collections.map(async collection => {
                collection.records.map(async record => {

                    const updateData = this.handleMappingValuesByKeys(
                        record.missKeys,
                        record.missKeys.map(
                            missKey => this.models[collection.name].schema.obj[missKey]['default']
                        )
                    ).object;

                    await this.models[collection.name].findByIdAndUpdate(
                        record._id,
                        {
                            $set: {
                                ...updateData
                            }
                        });
                });
            }));
        }
        catch (err) {
            this.logger.error(err.message);
            return;
        }
    }

    private handleMappingValuesByKeys(keysArr: string[], value: any): MappingKey {
        try {
            const mappingValue = (cur, index) => ({ [cur]: isArray(value) ? value[index] : value });
            return {
                list: keysArr.filter(item => this.isAcceptFilter(item)).reduce((acc, cur, index) => ([
                    ...acc,
                    mappingValue(cur, index)
                ]), []),
                object: keysArr.filter(item => this.isAcceptFilter(item)).reduce((acc, cur, index) => ({
                    ...acc,
                    ...mappingValue(cur, index)
                }), {})
            }
        }
        catch (err) {
            this.logger.error(err.message);
            return;
        }
    }

    private async syncDataLocal() {
        try {
            const entities = [
                'MeetingUser',
                'Meeting',
            ];

            const collections = await this.getRecords(entities);
            collections.map(item => console.log(item.name, item.records))
            await this.handleUpdateData(collections);
        }
        catch (err) {
            this.logger.error(err.message);
        }

    }

    private async syncDataDemo() {
        try {
            const entities = [
                'MeetingUser',
                'Meeting',
            ];

            const collections = await this.getRecords(entities);
            await this.handleUpdateData(collections);
        }
        catch (err) {
            this.logger.error(err.message);
            return;
        }
    }

    private async syncDataProd() {
        try {
            const entities = [
                'MeetingUser',
                'Meeting',
            ];

            const collections = await this.getRecords(entities);
            await this.handleUpdateData(collections);
        }
        catch (err) {
            this.logger.error(err.message);
            return;
        }
    }

    private async syncDataMultipleEnvs() {
        try {
            const syncData: EnvironmentMigration = {
                local: this.syncDataLocal,
                demo: this.syncDataDemo,
                production: this.syncDataProd
            }

            await syncData[this.environment ?? Environmens.Local].call(this);
        }
        catch (err) {
            this.logger.error(err.message);
            return;
        }
    }
}