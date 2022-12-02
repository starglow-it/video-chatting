import {
	ErrorState, ICommonUser 
} from 'shared-types';
import {
	BlockUserParams 
} from '../../types';
import {
	sendRequest 
} from '../../../helpers/http/sendRequest';
import {
	blockUserUrl 
} from '../../../const/urls/users';

export const handleBlockUser = async ({
	userId,
	isBlocked,
}: BlockUserParams): Promise<ICommonUser | undefined> => {
	if (userId) {
		const response = await sendRequest<ICommonUser, ErrorState>(
			blockUserUrl({
				userId,
				key: 'block',
				value: isBlocked,
			}),
		);

		if (response.success) {
			return response.result;
		}
	}
};
