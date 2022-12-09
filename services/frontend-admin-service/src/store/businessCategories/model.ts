import {
	QueryParams 
} from 'shared-types';
import {
	rootDomain 
} from '../domains';
import {
	BusinessCategoriesState 
} from '../types';

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
