import {
	NextPageContext 
} from 'next';
import {
	destroyCookie 
} from 'nookies';

export function deleteAuthCookies(ctx: NextPageContext | undefined) {
	destroyCookie(ctx, 'accessToken', {
		path: '/',
		expires: undefined,
	});
	destroyCookie(ctx, 'refreshToken', {
		path: '/',
		expires: undefined,
	});
}
