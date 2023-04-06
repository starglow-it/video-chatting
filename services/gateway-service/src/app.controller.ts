import { BadRequestException, Controller, Get, Logger } from "@nestjs/common";
import { ConfigClientService } from "./services/config/config.service";

@Controller()
export class AppController {
    constructor(private readonly configService: ConfigClientService) { }
    private readonly logger = new Logger();
    @Get('versions')
    async getVersions() {
        try {
            return {
                success: true,
                result: {
                    apiVersion: await this.configService.get('apiVersion'),
                    appVersion: await this.configService.get('appVersion')
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