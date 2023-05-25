import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { ConfigClientService } from "../services/config/config.service";
import { isArray } from "util";
import { Collection, Environmens, EnvironmentMigration, MappingKey } from "shared-types";

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationBootstrap {
    private environment: string;
    private models: Readonly<{ [index: string]: Model<any> }>;

    constructor(
        @InjectConnection() private connection: Connection,
        private readonly configService: ConfigClientService
    ) { }

    async onModuleInit() {
        this.environment = await this.configService.get('environment');
    }

    async onApplicationBootstrap() {
        if (this.connection.readyState !== 1) return;
        this.models = this.connection.models;

        await this.syncDataMultipleEnvs();
    }

    private isAcceptFilter(item: string): boolean {
        return item !== 'id';
    }

    private async getRecords(entities: string[]): Promise<Collection[]> {
        return (await Promise.all(entities.map(async modelName => {

            const schemaObject = this.models[modelName]?.schema.obj || {};

            const fieldList = Object.keys(schemaObject);

            const filterFields = (fieldList.flatMap(field => {
                if (typeof schemaObject[field]['default'] !== 'undefined') {
                    return {
                        key: field,
                        value: schemaObject[field]['default']
                    }
                }
            })).filter(Boolean);

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
                            filterFields.map(item => item.key),
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

    async handleUpdateData(collections: Collection[]) {
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

    private handleMappingValuesByKeys(keysArr: string[], value: any): MappingKey {
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

    private async syncDataLocal() {
        const entities = [
            'MeetingUser',
            'Meeting',
        ];

        const collections = await this.getRecords(entities);
        collections.map(item => console.log(item.name, item.records))
        await this.handleUpdateData(collections);

    }

    private async syncDataDemo() {
        const entities = [
            'MeetingUser',
            'Meeting',
        ];

        const collections = await this.getRecords(entities);
        await this.handleUpdateData(collections);
    }

    private async syncDataProd() {
        const entities = [
            'MeetingUser',
            'Meeting',
        ];

        const collections = await this.getRecords(entities);
        await this.handleUpdateData(collections);
    }

    private async syncDataMultipleEnvs() {
        const syncData: EnvironmentMigration = {
            local: this.syncDataLocal,
            demo: this.syncDataDemo,
            production: this.syncDataProd
        }

        await syncData[this.environment ?? Environmens.Local].call(this);
    }
}