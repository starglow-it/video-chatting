import { NextPageContext, GetServerSidePropsContext } from 'next';
import { setCookie } from 'nookies';
import { parse, serialize } from 'cookie';
import { AuthToken } from '../../store/types';

function updateAppContextCookie(
    ctx: NextPageContext | GetServerSidePropsContext | undefined,
    path: string,
    value: string,
    options: Object = {},
) {
    const parsed = parse(ctx?.req?.headers.cookie?.toString() ?? '');
    if (!parsed[path] && ctx?.req) {
        ctx.req.headers.cookie = ctx?.req?.headers.cookie + `; ${serialize(path, value, options)}`;
    }

    setCookie(ctx, path, value, options);
}

export default function setAuthCookies(
    ctx: NextPageContext | GetServerSidePropsContext | undefined,
    access?: AuthToken,
    refresh?: AuthToken,
): void {
    updateAppContextCookie(ctx, 'accessToken', access?.token as string, {
        expires: access ? new Date(access?.expiresAt) : 0,
        path: '/',
    });

    if (refresh) {
        updateAppContextCookie(ctx, 'refreshToken', refresh?.token as string, {
            expires: refresh ? new Date(refresh?.expiresAt) : 0,
            path: '/',
        });
    }
}
