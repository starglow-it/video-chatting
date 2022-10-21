import React from 'react';
import App from 'next/app';
import type { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import getConfig from 'next/config';
import { withHydrate } from 'effector-next';
import { hydrate } from 'effector';
import { Provider } from 'effector-react/ssr';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

// components
import { AdminLayout } from '@components/AdminLayout.tsx/AdminLayout';

// hooks
import { useScope } from 'shared-frontend';

// stores
import { $authStore, checkAdminAuthFx } from '../src/store';
import { rootDomain } from '../src/store/domains';

// helpers
import { redirectTo } from '../src/helpers/http/redirectTo';

// styles
import globalStyles from '../src/app.styles';

import { appWithTranslation } from '../i18n';

// themes
import { baseTheme } from '../src/themes/base';
import { typographyTheme } from '../src/themes/typography';
import { componentsTheme } from '../src/themes/components';
import { uiTheme } from '../src/themes/ui';

import createEmotionCache from '../src/createEmotionCache';

const { publicRuntimeConfig } = getConfig();

const globalStylesComponent = <GlobalStyles styles={globalStyles} />;

const clientSideEmotionCache = createEmotionCache();

const enhance = withHydrate();

const REDIRECT_ROUTES: string[] = ['/'];

// import '../src/validation';
//
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
                                <AdminLayout>
                                    <Component {...pageProps} />
                                </AdminLayout>
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

    const data = await checkAdminAuthFx(context.ctx);

    const pathName = context?.ctx?.pathname || '';

    const isRedirectRoute = REDIRECT_ROUTES.some(route =>
        new RegExp(route).test(pathName),
    );

    if (data.state.isAuthenticated && isRedirectRoute) {
        redirectTo(context?.ctx ?? null, 'statistics');
    }

    props.pageProps.initialState = {
        [`${$authStore.sid}`]: { state: data.state, error: data.error },
    };

    return props;
};

export default appWithTranslation(enhance(CustomApp));
