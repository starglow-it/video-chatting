import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Collection, Connection, Document, FilterQuery } from "mongoose";
import { ConfigClientService } from "../services/config/config.service";


enum Environmens {
    Local = 'local',
    Demo = 'demo',
    Production = 'production'
}

type Sync = {
    [K in Environmens]?: () => void
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationBootstrap {
    private environment: string;
    constructor(
        @InjectConnection() private connection: Connection,
        private readonly configService: ConfigClientService
    ) { }

    async onModuleInit() {
        this.environment = await this.configService.get('environment');
    }

    async onApplicationBootstrap() {
        const models = this.connection.models;
        console.log(Object.keys(models).length);


        const modelNames = this.connection.modelNames();
        await Promise.all(modelNames.map(async modelName => {
            // console.log(records);

            const schemaObjects = models[modelName].schema.obj;
            const fieldList = Object.keys(schemaObjects);

            // console.log(schemaObjects);
            
            const records = await models[modelName].aggregate([{
                $match: {
                    $or: this.reduceExistKeysQuery(fieldList)
                }
            }]).exec();
            
            console.log(modelName, records);
        }));

        await this.syncDataMultipleEnv();
    }

    private reduceExistKeysQuery(keysArr: string[]): FilterQuery<any[]> {
        return keysArr.filter(item => item !== 'id').reduce((acc, cur) => ([
            ...acc,
            {
                [cur]: { $exists: false}
            }
        ]), []);
    }

    private async syncDataMultipleEnv() {
        if (!this.connection.readyState) return;
        const environments = ['local','demo','product'];

        const syncData: Sync = {
            local: () => {
                console.log(this);
            }
        }

        console.log(syncData[this.environment]());
        

    }
}