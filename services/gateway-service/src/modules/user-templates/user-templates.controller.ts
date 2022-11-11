import {BadRequestException, Controller, Get, Logger, Param} from '@nestjs/common';
import {TemplatesService} from "../templates/templates.service";
import {ApiForbiddenResponse, ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {CommonTemplateRestDTO} from "../../dtos/response/common-template.dto";

@Controller('user-templates')
export class UserTemplatesController {
    private readonly logger = new Logger();
    constructor(
        private templatesService: TemplatesService,
    ) {}

    @Get('/:templateId')
    @ApiOperation({ summary: 'Get User Template' })
    @ApiOkResponse({
        type: CommonTemplateRestDTO,
        description: 'Get User Template Success',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    async getUserTemplate(@Param('templateId') templateId: string) {
        try {
            if (templateId) {
                const template = await this.templatesService.getUserTemplateById({
                    id: templateId,
                });

                return {
                    success: true,
                    result: template,
                };
            }
            return {
                success: false,
                result: null,
            };
        } catch (err) {
            this.logger.error(
                {
                    message: `An error occurs, while get common template`,
                },
                JSON.stringify(err),
            );

            throw new BadRequestException(err);
        }
    }
}
