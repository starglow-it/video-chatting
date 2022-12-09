import React from 'react';
import App from 'next/app';
import type {
	AppContext, AppProps 
} from 'next/app';
import Head from 'next/head';
import getConfig from 'next/config';
import {
	withHydrate 
} from 'effector-next';
import {
	hydrate 
} from 'effector';
import {
	Provider 
} from 'effector-react/ssr';
import {
	CacheProvider, EmotionCache 
} from '@emotion/react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import {
	GlobalStyles 
} from '@mui/styled-engine';
import CssBaseline from '@mui/material/CssBaseline';

// components
import {
	AdminLayout 
} from '@components/AdminLayout/AdminLayout';
import {
	ToastsNotifications 
} from '@components/ToastsNotifications/ToastsNotifications';

// hooks
import {
	useScope 
} from '@hooks/useScope';

// stores
import {
	$authStore, checkAdminAuthFx 
} from '../src/store';
import {
	rootDomain 
} from '../src/store/domains';

// helpers
import {
	redirectTo 
} from '../src/helpers/http/redirectTo';

// styles
import globalStyles from '../src/app.styles';

import {
	appWithTranslation 
} from '../i18n';

// themes
import {
	baseTheme 
} from '../src/themes/base';
import {
	typographyTheme 
} from '../src/themes/typography';
import {
	componentsTheme 
} from '../src/themes/components';
import {
	uiTheme 
} from '../src/themes/ui';

import createEmotionCache from '../src/createEmotionCache';

const {
	publicRuntimeConfig 
} = getConfig();

const globalStylesComponent = <GlobalStyles styles={globalStyles} />;

const clientSideEmotionCache = createEmotionCache();

const enhance = withHydrate();

const REDIRECT_ROUTES: string[] = ['/'];
const LOGIN_REDIRECT_ROUTES: string[] = ['/statistics'];

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

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>{publicRuntimeConfig.applicationName}</title>
				<meta
					name="viewport"
					content="initial-scale=1, width=device-width"
				/>
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

	const data = await checkAdminAuthFx(context.ctx);

	const pathName = context?.ctx?.pathname || '';

	const isLoginRedirectRoute = LOGIN_REDIRECT_ROUTES.some(route =>
		new RegExp(route).test(pathName),
	);

	const isAdminRedirectRoute = REDIRECT_ROUTES.some(
		route => route === pathName,
	);

	if (data?.state?.isAuthenticated && isAdminRedirectRoute) {
		redirectTo(context?.ctx ?? null, '/statistics');
	} else if (!data?.state?.isAuthenticated && isLoginRedirectRoute) {
		redirectTo(context?.ctx ?? null, '/');
	}

	props.pageProps.initialState = {
		[`${$authStore.sid}`]: {
			state: data?.state,
			error: null,
		},
	};

	return props;
};

export default appWithTranslation(enhance(CustomApp));
