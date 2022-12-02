import {
	ErrorState 
} from 'shared-types';
import {
	DeleteUserParams 
} from '../../types';
import {
	sendRequest 
} from '../../../helpers/http/sendRequest';
import {
	deleteUserUrl 
} from '../../../const/urls/users';

export const handleDeleteUser = async ({
	userId,
}: DeleteUserParams): Promise<void> => {
	if (userId) {
		await sendRequest<void, ErrorState>(
			deleteUserUrl({
				userId,
			}),
		);
	}
};
