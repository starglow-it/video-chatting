import { NextPageContext, GetServerSidePropsContext } from 'next';
import { setCookie } from 'nookies';
import { CookieSerializeOptions, parse, serialize } from 'cookie';
import { AuthToken } from 'shared-types';

function updateAppContextCookie(
    ctx: NextPageContext | GetServerSidePropsContext | undefined,
    path: string,
    value: string,
    options: CookieSerializeOptions,
) {
    const parsed = parse(ctx?.req?.headers.cookie?.toString() ?? '');
    if (!parsed[path] && ctx?.req) {
        ctx.req.headers.cookie = `${ctx?.req?.headers.cookie}; ${serialize(path, value, options)}`;
    }

    setCookie(ctx, path, value, options);
}

export function setAuthCookies(
    ctx: NextPageContext | GetServerSidePropsContext | undefined,
    access?: AuthToken,
    refresh?: AuthToken,
): void {
    updateAppContextCookie(ctx, 'accessToken', access?.token as string, {
        expires: access?.expiresAt && new Date(access?.expiresAt),
        path: '/',
    });

    if (refresh) {
        updateAppContextCookie(ctx, 'refreshToken', refresh?.token as string, {
            expires: refresh?.expiresAt && new Date(refresh?.expiresAt),
            path: '/',
        });
    }
}
