import { IUserTemplate } from 'shared-types';
import { EntityList } from '../../types';

export const initialProfileTemplatesStore: EntityList<IUserTemplate> = {
    list: [],
    count: 0,
};
