import { useEffect } from 'react';
import App from 'next/app';
import type { AppContext, AppProps } from 'next/app';
import Script from 'next/script';
import { NextResponse } from 'next/server';
import Head from 'next/head';
import getConfig from 'next/config';
import { withHydrate } from 'effector-next';
import { hydrate } from 'effector';
import { Provider } from 'effector-react/ssr';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Layout } from '@components/Layout/Layout';
import { SpinnerLoading } from '@components/Spinner/Spinner';

// hooks
import { useScope } from '@hooks/useScope';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import { ToastsNotifications } from '@components/ToastsNotifications/ToastsNotifications';
import { MeetingFinishedDialog } from '@components/Dialogs/MeetingFinishedDialog/MeetingFinishedDialog';

import {
    $profileStore,
    $authStore,
    checkAuthFx,
    $productsStore,
    $subscriptionStore,
    getStripeProductsFx,
    getSubscriptionFx,
} from '../src/store';

import { redirectTo } from '../src/helpers/http/redirectTo';
import createEmotionCache from '../src/createEmotionCache';
import globalStyles from '../src/app.styles';
import { appWithTranslation } from '../i18n';
import '../src/validation';

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
    setUpTemplateRoute,
    welcomeRoute,
    indexRoute,
    analyticsRoute,
} from '../src/const/client-routes';

const { publicRuntimeConfig } = getConfig();

const clientSideEmotionCache = createEmotionCache();

const enhance = withHydrate();

const REGISTER_REDIRECT_ROUTES: string[] = [
    loginRoute,
    registerRoute,
    welcomeRoute,
];
const LOGIN_REDIRECT_ROUTES: string[] = [dashboardRoute, analyticsRoute];

const CustomApp = ({
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
}: AppProps & { emotionCache: EmotionCache }): JSX.Element => {
    const scope = useScope(rootDomain, pageProps.initialState);

    if (pageProps.initialState) {
        hydrate(rootDomain, {
            values: pageProps.initialState,
        });
    }

    useEffect(() => {
        window.history.scrollRestoration = 'manual';
    }, []);

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>{publicRuntimeConfig.applicationName}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-NJ0KJKL2R3"
                strategy="lazyOnload"
            />
            <Script id="google-analytics-ruume" strategy="lazyOnload">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-NJ0KJKL2R3', {page_path: window.location.pathname});
                            
                `}
            </Script>
            <Script
                id="mouse-flow"
                strategy="lazyOnload"
                type="text/javascript"
            >
                {`window._mfq = window._mfq || [];
                (function() {
                    var mf = document.createElement("script");
                    mf.type = "text/javascript"; mf.defer = true;
                    mf.src = "//cdn.mouseflow.com/projects/7b0a8458-95f4-4761-98a1-8beade2d0dd4.js";
                    document.getElementsByTagName("head")[0].appendChild(mf);
            })();`}
            </Script>
            <Provider value={scope}>
                <ThemeProvider theme={baseTheme}>
                    <ThemeProvider theme={typographyTheme}>
                        <ThemeProvider theme={uiTheme}>
                            <ThemeProvider theme={componentsTheme}>
                                <SpinnerLoading />
                                <CssBaseline />
                                <GlobalStyles styles={globalStyles} />
                                <Layout>
                                    <Component {...pageProps} />
                                </Layout>
                                <ToastsNotifications />
                                <MeetingFinishedDialog />
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

    const pathName = context?.ctx?.pathname || '';
    const nextPageContext = context?.ctx ?? null;
    const data = await checkAuthFx(nextPageContext);
    const { isAuthenticated, isWithoutAuthen, user } = data;
    const registerTemplate = user?.registerTemplate;

    const isRegisterRedirectRoute = REGISTER_REDIRECT_ROUTES.some(route =>
        new RegExp(route).test(pathName),
    );

    const isLoginRedirectRoutes = LOGIN_REDIRECT_ROUTES.some(route =>
        new RegExp(route).test(pathName),
    );
    const isBaseRoute = pathName === indexRoute;

    const { host } = context?.ctx?.req?.headers || window?.location || {};

    if (publicRuntimeConfig.frontendUrl.includes(host)) {
        if (isWithoutAuthen) {
            if (isLoginRedirectRoutes || isBaseRoute)
                redirectTo(nextPageContext, loginRoute);
        } else {
            if (
                typeof registerTemplate !== 'undefined' &&
                !pathName.includes(setUpTemplateRoute) &&
                !user.fullName &&
                !user.companyName
            ) {
                redirectTo(
                    nextPageContext,
                    `${setUpTemplateRoute}/${registerTemplate || ''}`,
                );
            } else if (
                isAuthenticated &&
                (isRegisterRedirectRoute || isBaseRoute)
            ) {
                redirectTo(nextPageContext, dashboardRoute);
            } else if (
                !isAuthenticated &&
                (isLoginRedirectRoutes || isBaseRoute)
            ) {
                redirectTo(nextPageContext, welcomeRoute);
            }
        }
    } else {
        if (!isBaseRoute) {
            NextResponse.redirect('localhost:8000');
            // redirectTo(nextPageContext, 'localhost:8000')
        }
    }

    let products = [];
    let subscription = {};

    if (pathName.includes('dashboard')) {
        products = await getStripeProductsFx({ ctx: nextPageContext });
        subscription = await getSubscriptionFx({
            subscriptionId: user?.stripeSubscriptionId,
            ctx: nextPageContext,
        });
    }

    props.pageProps.initialState = {
        [`${$profileStore.sid}`]: {
            ...initialProfileState,
            ...user,
        },
        [`${$authStore.sid}`]: {
            isAuthenticated,
            isWithoutAuthen,
        },
        [`${$productsStore.sid}`]: products,
        [`${$subscriptionStore.sid}`]: subscription,
    };

    return props;
};

export default appWithTranslation(enhance(CustomApp));
