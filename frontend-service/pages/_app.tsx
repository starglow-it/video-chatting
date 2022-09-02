import React from 'react';
import App from 'next/app';
import type { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import getConfig from 'next/config';
import { withHydrate } from 'effector-next';
import { hydrate } from 'effector';
import { Provider } from 'effector-react/ssr';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Layout } from '@components/Layout/Layout';

// hooks
import { useScope } from '@hooks/useScope';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import { ToastsNotifications } from '@components/ToastsNotifications/ToastsNotifications';

import { $profileStore, $authStore, checkAuthFx } from '../src/store';

import { redirectTo } from '../src/helpers/http/redirectTo';
import createEmotionCache from '../src/createEmotionCache';
import globalStyles from '../src/app.styles';
import { appWithTranslation } from '../i18n';

// themes
import { baseTheme } from '../src/themes/base';
import { typographyTheme } from '../src/themes/typography';
import { componentsTheme } from '../src/themes/components';
import { uiTheme } from '../src/themes/ui';

// stores
import { initialProfileState } from '../src/store/profile/profile/const';
import { rootDomain } from '../src/store/domains';
import {
    dashboardRoute,
    loginRoute,
    registerRoute,
    welcomeRoute,
} from '../src/const/client-routes';

const { publicRuntimeConfig } = getConfig();

const globalStylesComponent = <GlobalStyles styles={globalStyles} />;

const clientSideEmotionCache = createEmotionCache();

const enhance = withHydrate();

const REGISTER_REDIRECT_ROUTES: string[] = [loginRoute, registerRoute, welcomeRoute];
const LOGIN_REDIRECT_ROUTES: string[] = [dashboardRoute];

const CustomApp = ({
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
}: AppProps & { emotionCache: EmotionCache }): JSX.Element => {
    const scope = useScope(rootDomain, pageProps.initialState);

    if (pageProps.initialState) {
        hydrate(rootDomain, { values: pageProps.initialState });
    }

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>{publicRuntimeConfig.applicationName}</title>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <Provider value={scope}>
                <ThemeProvider theme={baseTheme}>
                    <ThemeProvider theme={typographyTheme}>
                        <ThemeProvider theme={uiTheme}>
                            <ThemeProvider theme={componentsTheme}>
                                <CssBaseline />
                                {globalStylesComponent}
                                <Layout>
                                    <Component {...pageProps} />
                                </Layout>
                                <ToastsNotifications />
                            </ThemeProvider>
                        </ThemeProvider>
                    </ThemeProvider>
                </ThemeProvider>
            </Provider>
        </CacheProvider>
    );
};

CustomApp.getInitialProps = async (context: AppContext) => {
    const props = await App.getInitialProps(context);

    const data = await checkAuthFx(context.ctx);

    const pathName = context?.ctx?.pathname || '';

    const isRegisterRedirectRoute = REGISTER_REDIRECT_ROUTES.some(route =>
        new RegExp(route).test(pathName),
    );

    const isLoginRedirectRoutes = LOGIN_REDIRECT_ROUTES.some(route =>
        new RegExp(route).test(pathName),
    );

    if (data.isAuthenticated && isRegisterRedirectRoute) {
        redirectTo(context?.ctx ?? null, dashboardRoute);
    } else if (!data.isAuthenticated && isLoginRedirectRoutes) {
        redirectTo(context?.ctx ?? null, loginRoute);
    }

    props.pageProps.initialState = {
        [`${$profileStore.sid}`]: { ...initialProfileState, ...data.user },
        [`${$authStore.sid}`]: { isAuthenticated: data.isAuthenticated },
    };

    return props;
};

export default appWithTranslation(enhance(CustomApp));
