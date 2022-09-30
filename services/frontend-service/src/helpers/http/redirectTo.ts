/* eslint-disable */
import Router from 'next/router';
import { NextPageContext } from 'next';
import isServer from '../isServer';

export const redirectTo = (ctx: NextPageContext | null, path: string) => {
    if (isServer() && ctx) {
        // @ts-ignore
        ctx.res.statusCode = 302;
        ctx?.res?.setHeader('Location', path);
    } else {
        Router.replace(path);
    }
};
