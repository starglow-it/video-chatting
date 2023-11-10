import { IBusinessCategory } from '../api-interfaces';
import { FilterQuery, QueryParams } from '../common';

export type GetBusinessCategoriesPayload = Pick<
  QueryParams,
  'skip' | 'limit'
> & { query?: FilterQuery<IBusinessCategory> };

export type CreateBusinessCategoryPayload = {
  key: IBusinessCategory['key'];
  value: IBusinessCategory['value'];
  color: IBusinessCategory['color'];
  icon: IBusinessCategory['icon'];
};

export type UpdateBusinessCategoryPayload = {
  id: string;
  data: Partial<IBusinessCategory>;
};

export type DeletesBusinessCategoriesPayload = {
  ids: string[];
};
