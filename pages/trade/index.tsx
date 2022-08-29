import { SyntheticEvent, useState } from 'react'

import { NextPage } from 'next'

import { Tab, Tabs } from '@mui/material'
import TabPanel from 'components/TabPanel'
import styled from 'styled-components'
import Liquidity from 'views/trade/Liquidity'
import Swap from 'views/trade/Swap'

const Layout = styled.div`
	min-height: calc(100vh - 363px);
`

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	color: #ffffff;
	padding: 40px 0;

	@media screen and (max-width: 800px) {
		padding: 160px 0;
	}

	@media screen and (max-width: 500px) {
		padding: 14px 0 0;
	}
`

const Container = styled.div`
	width: 480px;
	padding: 12px;
	background: rgb(25, 16, 52);
	border-radius: 32px;
	box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px,
		rgb(25 19 38 / 5%) 0px 1px 1px;
	color: rgb(255, 255, 255);
	overflow: hidden;
	.MuiTabs-flexContainer {
		display: inline-flex;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 24px;
		overflow: hidden;
	}

	@media screen and (max-width: 500px) {
		width: 100%;
		margin: 0 10px;
	}
`

const TabCustom = styled(Tabs)`
	position: relative;
	z-index: 0;
	font-family: 'Poppins', san-serifs;
	.MuiTabs-scroller {
		.MuiButtonBase-root {
			color: #fff;
			font-size: 20px;
			font-weight: 600;
			text-transform: inherit;
			flex: 1;
			padding: 0 24px;
		}
		.MuiTabs-indicator {
			z-index: -1;
			height: 100%;
			background: linear-gradient(310deg, #cb7fcc 25%, #fc52ff 100%);
			border-radius: 24px;
		}
	}
`

const Center = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const TABS = {
	swap: 'Swap',
	pool: 'Liquidity'
}

const Trade: NextPage = () => {
	const [tab, setTab] = useState(TABS.swap)

	const handleChangeTab = (
		_: SyntheticEvent<Element, Event>,
		value: string
	) => {
		setTab(value)
	}

	return (
		<Layout>
			<Wrapper>
				<Container>
					<Center>
						<TabCustom value={tab} onChange={handleChangeTab}>
							<Tab label={TABS.swap} value={TABS.swap} />
							<Tab label={TABS.pool} value={TABS.pool} />
						</TabCustom>
					</Center>

					<TabPanel value={tab} index={TABS.swap}>
						<Swap />
					</TabPanel>
					<TabPanel value={tab} index={TABS.pool}>
						<Liquidity />
					</TabPanel>
				</Container>
			</Wrapper>
		</Layout>
	)
}

export async function getStaticProps() {
	return {
		props: {
			title: 'Trade: Swap & Liquidity',
			description: 'This is a description for Trade'
		}
	}
}

export default Trade
