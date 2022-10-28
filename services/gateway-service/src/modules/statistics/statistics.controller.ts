import {BadRequestException, Controller, Get, Logger} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResponseSumType } from "shared";

// services
import { ConfigClientService } from '../../services/config/config.service';
import { CoreService } from '../../services/core/core.service';

@Controller('statistics')
export class StatisticsController {
  private readonly logger = new Logger();

  constructor(
    private configService: ConfigClientService,
    private coreService: CoreService,
  ) {}

  @Get('/users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Users Statistics' })
  @ApiOkResponse({
    description: 'Users statistics retrieved successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getUsersStatistics(): Promise<ResponseSumType<{
    totalNumber: number,
    users: any
  }>> {
    const usersCount = await this.coreService.countUsers({
      isConfirmed: true,
    });

    const countryStatistics = await this.coreService.getCountryStatistics({});

    return {
      result: {
        totalNumber: usersCount,
        users: countryStatistics,
      },
      success: true,
    };
  }

  @Get('/subscriptions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Subscriptions Statistics' })
  @ApiOkResponse({
    description: 'Subscriptions statistics retrieved successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getSubscriptionsStatistics(): Promise<ResponseSumType<{
    totalNumber: number;
    subscriptions: {
      house: number,
      business: number,
      professional: number
    }
  }>> {
    try {
      const startData = {
        house: 0,
        business: 0,
        professional: 0
      };

      const usersWithSubscriptions = await this.coreService.findUsers({
        isConfirmed: true,
      });

      const subscriptionsData = usersWithSubscriptions.reduce((acc, b) => {
        const planKey = b?.subscriptionPlanKey?.toLowerCase();

        return {...acc, [planKey]: acc[planKey] + 1 }
      }, startData);

      const totalNumber = Object.values(subscriptionsData).reduce((acc, b) => acc + b, 0);

      return {
        result: {
          totalNumber,
          subscriptions: subscriptionsData,
        },
        success: true,
      };
    } catch (err) {
      this.logger.error(
          {
            message: `An error occurs, while get admin profile`,
          },
          JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }
}
