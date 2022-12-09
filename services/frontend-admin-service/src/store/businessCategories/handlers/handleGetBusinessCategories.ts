import {
	BusinessCategoryList, ErrorState, QueryParams 
} from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import {
	BusinessCategoriesState 
} from '../../types';
import {
	getBusinessCategoriesUrl 
} from '../../../const/urls/businessCategories';

export const handleGetBusinessCategories = async ({
	limit,
	skip,
}: QueryParams): Promise<BusinessCategoriesState> => {
	const response = await sendRequestWithCredentials<
        BusinessCategoryList,
        ErrorState
    >(
    	getBusinessCategoriesUrl({
    		limit,
    		skip,
    	}),
    );

	if (response.success) {
		return {
			state: response.result!,
			error: null,
		};
	}

	return {
		state: {
			list: [],
			count: 0,
		},
		error: response.error,
	};
};
