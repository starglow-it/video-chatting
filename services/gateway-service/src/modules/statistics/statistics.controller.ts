import {BadRequestException, Controller, Get, Logger, Param, Query,} from '@nestjs/common';
import {ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation,} from '@nestjs/swagger';
import {
  ICommonUserStatistic,
  ResponseSumType,
  RoomRatingStatistics,
  RoomsStatistics,
  SubscriptionsStatisticsType,
  UserRoles,
  UserStatistics,
} from 'shared-types';

// services
import {ConfigClientService} from '../../services/config/config.service';
import {CoreService} from '../../services/core/core.service';
import {TemplatesService} from '../templates/templates.service';

@Controller('statistics')
export class StatisticsController {
  private readonly logger = new Logger();

  constructor(
    private configService: ConfigClientService,
    private coreService: CoreService,
    private templatesService: TemplatesService,
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
  async getUsersStatistics(): Promise<ResponseSumType<UserStatistics>> {
    try {
      const usersCount = await this.coreService.countUsers({
        isConfirmed: true,
        role: UserRoles.User,
      });

      const countryStatistics = await this.coreService.getCountryStatistics({});

      return {
        result: {
          totalNumber: usersCount,
          data: countryStatistics,
        },
        success: true,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get users statistics`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
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
  async getSubscriptionsStatistics(): Promise<
    ResponseSumType<SubscriptionsStatisticsType>
  > {
    try {
      const startData = [
        { label: 'House', value: 0, color: '#FF884E' },
        { label: 'Professional', value: 0, color: '#69E071' },
        { label: 'Business', value: 0, color: '#2E6DF2' },
      ];

      const usersWithSubscriptions = await this.coreService.findUsers({
        query: {
          isConfirmed: true,
          role: UserRoles.User,
        },
      });

      const subscriptionsData = usersWithSubscriptions.reduce(
        (acc, b) =>
          acc.map((data) =>
            data.label === b?.subscriptionPlanKey
              ? { ...data, value: data.value + 1 }
              : data,
          ),
        startData,
      );

      const totalNumber = Object.values(subscriptionsData).reduce(
        (acc, b) => acc + b.value,
        0,
      );

      return {
        result: {
          totalNumber,
          data: subscriptionsData,
        },
        success: true,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get subscriptions statistics`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/rooms')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Rooms Statistics' })
  @ApiOkResponse({
    description: 'Rooms statistics retrieved successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getRoomsStatistics(): Promise<ResponseSumType<RoomsStatistics>> {
    try {
      const commonTemplates = await this.templatesService.getCommonTemplates({
        query: { draft: false, isDeleted: false },
        options: {
          skip: 0,
          limit: 0,
        },
      });

      const totalNumber = commonTemplates?.list?.reduce((acc) => acc + 1, 0);

      const customTemplates = commonTemplates?.list
        ?.filter((template) => template.author)
        .reduce((acc) => ({ ...acc, value: acc.value + 1 }), {
          label: 'Custom Rooms',
          value: 0,
          color: '#2E6DF2',
        });

      const platformTemplates = commonTemplates?.list
        ?.filter((template) => !template.author)
        .reduce((acc) => ({ ...acc, value: acc.value + 1 }), {
          label: 'Platform Rooms',
          value: 0,
          color: '#FF884E',
        });

      return {
        result: {
          totalNumber,
          data: [platformTemplates, customTemplates],
        },
        success: true,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get rooms statistics`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/rating')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Rooms Rating Statistic' })
  @ApiOkResponse({
    description: 'Rooms rating statistic retrieved successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getRoomsRatingStatistic(
    @Query('basedOn') basedOn: string,
    @Query('roomType') roomType: string,
  ): Promise<ResponseSumType<RoomRatingStatistics>> {
    try {
      const roomsStatistics = await this.coreService.getRoomRatingStatistic({
        ratingKey: basedOn,
        roomKey: roomType,
      });

      return {
        result: {
          totalNumber: roomsStatistics?.length,
          data: roomsStatistics,
        },
        success: true,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get rooms rating statistic`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/monetization')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Monetization Statistic' })
  @ApiOkResponse({
    description: 'Monetization statistic retrieved successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getMonetizationStatistic(
    @Query('period') period: string,
    @Query('type') type: string,
  ): Promise<ResponseSumType<any>> {
    try {
      const monetizationStatistic =
        await this.coreService.getMonetizationStatistic({
          type,
          period,
        });

      return {
        result: monetizationStatistic,
        success: true,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get monetization statistic`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/user/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User Profile Statistic' })
  @ApiOkResponse({
    description: 'User profile statistic retrieved successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getUserProfileStatistic(
    @Param('userId') userId: string,
  ): Promise<ResponseSumType<ICommonUserStatistic>> {
    try {
      const userProfileStatistic =
        await this.coreService.getUserProfileStatistic({
          userId,
        });

      return {
        result: userProfileStatistic,
        success: true,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get monetization statistic`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }
}
