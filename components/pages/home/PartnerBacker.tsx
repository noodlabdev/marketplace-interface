import { Grid } from '@mui/material'
import { Container } from '@mui/system'
import Title from 'components/Title'
import styled from 'styled-components'

const Wrapper = styled.div`
	color: #fff;
	h1 {
		text-align: center;
	}
	img {
		width: 100%;
		max-width: 100%
		height: auto;
	}
	.MuiPaper-root {
		display: flex;
		align-items: 'center;
	}
	.MuiGrid-root.MuiGrid-container {
		place-items: center;
	}

	.MuiGrid-root {
		margin-bottom: 24px;
	}
`

const asWillComes = [
	'/images/pancakeswap.png',
	'/images/coingecko.png',
	'/images/coinmarketcap.png',
	'/images/bsc.png',
	'/images/poocoin.png'
]

const strategics = [
	'/images/pinksale.png',
	'/images/nabox.png',
	'/images/chainlink.png'
]

const asSeens = [
	'/images/yahoo.png',
	'/images/cntoken.png',
	'/images/marketwatch.png',
	// '/images/moontok.png',
	// '/images/btok.png',
	'/images/crypto.com.png',
	'/images/dappradar.png'
]

const PartnerBacker = () => {
	return (
		<Wrapper>
			<Container>
				<Title>PINKPIGGY WILL BE ON</Title>
				<Grid alignItems="center" justifyContent="center" container spacing={4}>
					{asWillComes.map((e, i) => (
						<Grid key={i} item xs={4} md={4} lg={3} xl={2}>
							<div>
								<img src={e} alt="logo" />
							</div>
						</Grid>
					))}
				</Grid>

				<Title>STRATEGIC PARTNERS</Title>
				<Grid alignItems="center" justifyContent="center" container spacing={4}>
					{strategics.map((e, i) => (
						<Grid key={i} item xs={4} md={4} lg={3} xl={2}>
							<div>
								<img src={e} alt="logo" />
							</div>
						</Grid>
					))}
				</Grid>

				<Title>AS SEEN IN</Title>
				<Grid alignItems="center" justifyContent="center" container spacing={4}>
					{asSeens.map((e, i) => (
						<Grid key={i} item xs={4} md={4} lg={3} xl={2}>
							<div>
								<img src={e} alt="logo" />
							</div>
						</Grid>
					))}
				</Grid>
			</Container>
		</Wrapper>
	)
}

export default PartnerBacker
