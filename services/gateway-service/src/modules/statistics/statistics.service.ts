import { Injectable } from '@nestjs/common';
import { CoreService } from '../../services/core/core.service';
import {
  GetMonetizationStatisticPayload,
  GetRoomRatingStatisticPayload,
  GetRoomsPayload,
  GetUserProfileStatisticPayload,
  ICommonUserStatistic,
  ICountryStatistic,
  IRoomsRatingStatistic,
  IRooms,
} from 'shared-types';
import { CoreBrokerPatterns, StatisticBrokerPatterns } from 'shared-const';

@Injectable()
export class StatisticsService {
  constructor(private coreService: CoreService) {}

  async getRoomRatingStatistic(
    payload: GetRoomRatingStatisticPayload,
  ): Promise<IRoomsRatingStatistic[]> {
    const pattern = { cmd: StatisticBrokerPatterns.GetRoomRatingStatistic };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getRooms(
    payload: GetRoomsPayload,
  ): Promise<IRooms[]> {
    const pattern = { cmd: StatisticBrokerPatterns.GetRooms };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getMonetizationStatistic(
    payload: GetMonetizationStatisticPayload,
  ): Promise<IRoomsRatingStatistic[]> {
    const pattern = { cmd: StatisticBrokerPatterns.GetMonetizationStatistic };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getUserProfileStatistic(
    payload: GetUserProfileStatisticPayload,
  ): Promise<ICommonUserStatistic> {
    const pattern = { cmd: StatisticBrokerPatterns.GetUserProfileStatistic };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getCountryStatistics(): Promise<ICountryStatistic[]> {
    const pattern = { cmd: CoreBrokerPatterns.GetCountryStatistics };

    return this.coreService.sendCustom(pattern, {});
  }
}
