import React, { useState, useCallback } from 'react';
import { Button, ButtonGroup, Icon, Box, Divider, Chip, Margins, Skeleton } from '@rocket.chat/fuselage';

import Page from '../../components/basic/Page';
import AppAvatar from '../../components/basic/avatar/AppAvatar';
import ExternalLink from '../../components/basic/ExternalLink';
import { useRoute } from '../../contexts/RouterContext';
import PriceDisplay from './PriceDisplay';
import AppStatus from './AppStatus';
import { useTranslation } from '../../contexts/TranslationContext';
import { useAppInfo } from './hooks/useAppInfo';
import AppMenu from './AppMenu';
import { useLoggedInCloud } from './hooks/useLoggedInCloud';

function AppDetailsPageContent({ data, setModal, isLoggedIn }) {
	const t = useTranslation();

	const {
		iconFileData = '',
		name,
		author: { name: authorName, homepage, support } = {},
		description,
		categories = [],
		version,
		price,
		purchaseType,
		pricingPlans,
		iconFileContent,
		installed,
		bundledIn,
	} = data;


	return <>
		<Box display='flex' flexDirection='row' mbe='x20' w='full'>
			<AppAvatar size='x120' mie='x20' iconFileContent={iconFileContent} iconFileData={iconFileData}/>
			<Box display='flex' flexDirection='column' justifyContent='space-between' flexGrow={1}>
				<Box fontScale='h1'>{name}</Box>
				<Box display='flex' flexDirection='row' color='hint' alignItems='center'>
					<Box fontScale='p2' mie='x4'>{t('By_author', { author: authorName })}</Box>
			|
					<Box mis= 'x4'>{t('Version_version', { version })}</Box>
				</Box>
				<Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
					<Box flexGrow={1} display='flex' flexDirection='row' alignItems='center'>
						<AppStatus mie='x4' app={data} setModal={setModal} isLoggedIn={isLoggedIn}/>
						{!installed && <PriceDisplay mis='x4' purchaseType={purchaseType} pricingPlans={pricingPlans} price={price} showType={false}/>}
					</Box>
					{installed && <AppMenu app={data} setModal={setModal} isLoggedIn={isLoggedIn} />}
				</Box>
			</Box>
		</Box>
		<Divider />
		<Box display='flex' flexDirection='column'>

			<Margins block='x12'>
				<Box fontScale='s2'>{t('Categories')}</Box>
				<Box display='flex' flexDirection='row'>
					{categories && categories.map((current) => <Chip key={current} textTransform='uppercase' mie='x8'><Box color='hint'>{current}</Box></Chip>)}
				</Box>

				<Box fontScale='s2'>{t('Contact')}</Box>
				<Box display='flex' flexDirection='row' flexGrow={1} justifyContent='space-around' flexWrap='wrap'>
					<Box display='flex' flexDirection='column' mie='x12' flexGrow={1}>
						<Box fontScale='s1' color='hint'>{t('Author_Site')}</Box>
						<ExternalLink url={homepage}/>
					</Box>
					<Box display='flex' flexDirection='column' flexGrow={1}>
						<Box fontScale='s1' color='hint'>{t('Support')}</Box>
						<ExternalLink url={support}/>
					</Box>
				</Box>

				<Box fontScale='s2'>{t('Details')}</Box>
				<Box display='flex' flexDirection='row'>{description}</Box>
			</Margins>

		</Box>
		{bundledIn && <>
			<Divider />
			<Box display='flex' flexDirection='column'>
				<Margins block='x12'>
					<Box fontScale='s2'>{t('Bundles')}</Box>
					{bundledIn.map((bundle) => <Box key={bundle.bundleId} display='flex' flexDirection='row' alignItems='center'>
						<Box width='x80' height='x80' display='flex' flexDirection='row' justifyContent='space-around' flexWrap='wrap' flexShrink={0}>
							{bundle.apps.map((app) => <AppAvatar size='x36' key={app.latest.name} iconFileContent={app.latest.iconFileContent} iconFileData={app.latest.iconFileData}/>)}
						</Box>
						<Box display='flex' flexDirection='column' mis='x12'>
							<Box fontScale='p2'>{bundle.bundleName}</Box>
							{bundle.apps.map((app) => <Box key={app.latest.name}>{app.latest.name},</Box>)}
						</Box>
					</Box>)}
				</Margins>
			</Box>
		</>}
	</>;
}

const LoadingDetails = () => <Box display='flex' flexDirection='row' mbe='x20' w='full'>
	<Skeleton variant='rect' w='x120' h='x120' mie='x20'/>
	<Box display='flex' flexDirection='column' justifyContent='space-between' flexGrow={1}>
		<Skeleton variant='rect' w='full' h='x32'/>
		<Skeleton variant='rect' w='full' h='x32'/>
		<Skeleton variant='rect' w='full' h='x32'/>
	</Box>
</Box>;

export default function AppDetailsPage({ id }) {
	const t = useTranslation();
	const [modal, setModal] = useState(null);

	const data = useAppInfo(id);

	const router = useRoute('admin-apps');
	const handleReturn = useCallback(() => router.push({}));

	const isLoggedIn = useLoggedInCloud();

	const isLoading = Object.values(data).length === 0;

	return <><Page flexDirection='column'>
		<Page.Header title={t('App_Details')}>
			<ButtonGroup>
				<Button primary disabled>
					{t('Save_changes')}
				</Button>
				<Button onClick={handleReturn}>
					<Icon name='back'/>
					{t('Back')}
				</Button>
			</ButtonGroup>
		</Page.Header>
		<Page.ScrollableContentWithShadow maxWidth='x600' w='full' alignSelf='center'>
			{isLoading && <LoadingDetails />}
			{!isLoading && <AppDetailsPageContent data={data} setModal={setModal} isLoggedIn={isLoggedIn}/>}
		</Page.ScrollableContentWithShadow>
	</Page>{modal}</>;
}
