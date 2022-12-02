import React, {
	memo, useCallback, useEffect, useMemo 
} from 'react';
import linkify from 'linkify-string';
import {
	useRouter 
} from 'next/router';

// hooks
import {
	useLocalization 
} from '@hooks/useTranslation';
import {
	useNavigation 
} from '@hooks/useNavigation';

// custom
import {
	CustomGrid, CustomChip 
} from 'shared-frontend/library';
import {
	CustomTypography 
} from '@library/custom/CustomTypography/CustomTypography';
import {
	CustomPaper 
} from '@library/custom/CustomPaper/CustomPaper';

// icons
import {
	ArrowLeftIcon 
} from 'shared-frontend/icons';

// shared
import {
	CustomImage 
} from 'shared-frontend/library';

// const
import {
	Translation 
} from '@library/common/Translation/Translation';
import frontendConfig from '../../const/config';

// styles
import styles from './Agreements.module.scss';

enum Tabs {
    TermsOfService = 'termsOfService',
    PrivacyPolicy = 'privacyPolicy',
}

const tabs = [
	{
		value: Tabs.TermsOfService,
		translationKey: 'terms',
	},
	{
		value: Tabs.PrivacyPolicy,
		translationKey: 'privacy',
	},
];

const Component = () => {
	const {
		translation 
	} = useLocalization('static');

	const {
		activeTab, 
		onChange: onChangeTab 
	} = useNavigation({
		tabs,
	});

	const router = useRouter();

	const handleGoBack = useCallback(() => {
		router.back();
	}, [router]);

	useEffect(() => {
		if (router.query.section === 'privacy') {
			onChangeTab(Tabs.PrivacyPolicy);
		}
	}, [router.query]);

	const textWithLinks = useMemo(() => {
		const {
			translationKey 
		} = activeTab;
		return linkify(
			translation(`${translationKey}.text`, {
				domainLink: frontendConfig.frontendUrl,
			}),
			{
				target: '_blank',
			},
		);
	}, [activeTab.translationKey]);

	const chips = useMemo(
		() =>
			tabs.map(({
				value, 
				translationKey 
			}) => (
				<CustomChip
					active={value === activeTab.value}
					label={
						<CustomTypography>
							<Translation
								nameSpace="static"
								translation={`${translationKey}.title`}
							/>
						</CustomTypography>
					}
					className={styles.chip}
					onClick={() => onChangeTab(value)}
				/>
			)),
		[activeTab, translation, onChangeTab],
	);

	return (
		<CustomGrid
			className={styles.agreementsWrapper}
			container
			justifyContent="center"
		>
			<CustomGrid
				container
				alignItems="center"
				justifyContent="center"
				gap={1.5}
			>
				<CustomImage
					src="/images/agreements.png"
					width="40px"
					height="40px"
				/>
				<CustomTypography
					variant="h1"
					nameSpace="static"
					translation="agreements.title"
				/>
			</CustomGrid>
			<CustomGrid
				container
				justifyContent="space-between"
				className={styles.chipsContainer}
			>
				<CustomGrid
					container
					justifyContent="center"
					alignItems="center"
					onClick={handleGoBack}
					className={styles.backButton}
				>
					<ArrowLeftIcon
						width="32px"
						height="32px"
					/>
				</CustomGrid>
				<CustomGrid
					item
					container
					gap={1.5}
					width="fit-content"
					justifyContent="center"
				>
					{chips}
				</CustomGrid>
				<CustomGrid
					item
					className={styles.emptyItem}
				/>
			</CustomGrid>
			<CustomPaper className={styles.content}>
				<CustomGrid
					container
					direction="column"
					alignItems="center"
					justifyContent="center"
				>
					<CustomTypography
						variant="h2bold"
						nameSpace="static"
						translation={`${activeTab.translationKey}.title`}
					/>
					<CustomTypography
						variant="body2bold"
						className={styles.termsText}
						dangerouslySetInnerHTML={{
							__html: textWithLinks,
						}}
					/>
				</CustomGrid>
			</CustomPaper>
		</CustomGrid>
	);
};

export const Agreements = memo(Component);
