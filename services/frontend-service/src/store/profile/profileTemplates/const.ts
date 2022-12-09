import { EntityList } from '../../types';
import {IUserTemplate} from "shared-types";

export const initialProfileTemplatesStore: EntityList<IUserTemplate> = {
    list: [],
    count: 0,
};
