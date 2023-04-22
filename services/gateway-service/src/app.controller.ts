import { BadRequestException, Controller, Get, Logger, OnModuleInit, Param, Query } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { CoreBrokerPatterns } from "shared-const";
import { ConfigClientService } from "./services/config/config.service";
import { CoreService } from "./services/core/core.service";


enum Collection {
    MediaCategory = 'mediaCategory',
    Media = 'media',
    UserTemplateMedia = 'userTemplateMedia'
}
class TestingStagingRequest {
    @ApiProperty({
        type: String,
        enum: Collection
    })
    @IsEnum(Collection)
    collection: string;
}

@Controller()
export class AppController implements OnModuleInit {
    constructor(
        private readonly configService: ConfigClientService,
        private coreService: CoreService
    ) { }

    private readonly logger = new Logger();
    private apiVersion: string;
    private appVersion: string;

    async onModuleInit() {
        this.apiVersion = await this.configService.get('apiVersion');
        this.appVersion = await this.configService.get('appVersion');
    }



    @Get('staging/:collection')
    async getDBOnStaging(@Param() param: TestingStagingRequest) {
        try {
            const pattern = { cmd: 'testing' };
            console.log(param);
            return await this.coreService.sendCustom(pattern, {collection: param.collection});
        }
        catch(err){
            console.log(err);
            
        }

    }


    @Get('versions')
    async getVersions() {
        try {
            return {
                success: true,
                result: {
                    apiVersion: this.apiVersion,
                    appVersion: this.appVersion
                }
            }
        }
        catch (err) {
            this.logger.error(
                {
                    message: `An error occurs, while get api version`,
                },
                JSON.stringify(err),
            );
            throw new BadRequestException(err);
        }
    }
}