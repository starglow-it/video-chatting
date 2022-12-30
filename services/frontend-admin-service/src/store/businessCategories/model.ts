import { QueryParams} from 'shared-types';
import {rootDomain, templatesDomain} from '../domains';
import { BusinessCategoriesState } from '../types';

export const $businessCategoriesStore =
    rootDomain.createStore<BusinessCategoriesState>({
    	state: {
    		list: [],
    		count: 0,
    	},
    	error: null,
    });

export const getBusinessCategoriesFx = rootDomain.createEffect<
    QueryParams,
    BusinessCategoriesState
>('getBusinessCategoriesFx');
export const getBusinessCategoriesEvent = templatesDomain.createEvent<QueryParams>('getBusinessCategoriesEvent');

