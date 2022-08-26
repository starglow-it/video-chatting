import { NextPageContext } from 'next';
import { destroyCookie } from 'nookies';
import { clientRoutes } from '../../const/client-routes';

export function deleteAuthCookies(ctx: NextPageContext | undefined) {
    destroyCookie(ctx, 'accessToken', {
        path: clientRoutes.indexRoute,
        expires: undefined,
    });
    destroyCookie(ctx, 'refreshToken', {
        path: clientRoutes.indexRoute,
        expires: undefined,
    });
}
