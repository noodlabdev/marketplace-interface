import { FC } from 'react'

import { Button, Container, Grid } from '@mui/material'
import { Description, Title } from 'components'
import styled from 'styled-components'
import { BgGradient, Section } from 'styles'

const BoxBgGradient = styled(BgGradient)`
	padding: 25px 20px;
	border-radius: 20px;
	box-shadow: 0px 20px 54px rgba(133, 122, 180, 0.3);
	.boxTitle {
		margin-bottom: 14px;
	}

	.boxDescription {
		margin-bottom: 20px;
	}

	.boxButton {
		padding: 8px 22px;
		background-color: ${({ theme }) => theme?.colors?.darkPurple4};
		border-radius: ${({ theme }) => theme?.borderRadiusBase};
	}
`

const ImageContainer = styled.div`
	position: relative;
	display: flex;
	width: 100%;
	height: 100%;
	align-items: center;
	> span {
		position: relative;
		width: 100% !important;
		height: 100% !important;
	}
	img {
		max-width: 100%;
		object-fit: contain;
	}
`

const MapEcosystemContainer = styled(Section)`
	// background-image: url(/images/ecosystem-bg-top-left.svg),
	// 	url(/images/ecosystem-bg-bottom-right.svg);
	// background-position: top left, bottom right;
	// background-repeat: no-repeat, no-repeat;
	// background-size: 25.9%, 25.9%;
	.title {
		margin-bottom: 16px;
		text-align: center;
	}
	.description {
		margin-bottom: 50px;
		text-align: center;
	}
	${BoxBgGradient} + ${BoxBgGradient} {
		margin-top: 20px;
	}

	@media screen and (max-width: 1700px) {
		.description {
			margin-bottom: 20px;
		}
	}
`

export const MapEcosystem: FC = () => {
	return (
		<MapEcosystemContainer className="homepage-ecosystem">
			<Container>
				<Grid container columns={12} justifyContent="center">
					<Grid item xl={5} lg={6} md={8} sm={10} xs={12}>
						<Title headingType="h2" size="md" className="title">
							FEATURE OF PINK PIGGY
						</Title>
						{/* <Description size="sm" className="description">
							Huta ecosystem is custom-built to the needs of any individual,
							private entity or government institution.
						</Description> */}
					</Grid>
				</Grid>
				<Grid
					container
					columns={12}
					flexDirection="row-reverse"
					spacing={{ xs: 3, md: 4, lg: 8 }}>
					<Grid item lg={7} md={6} xs={12}>
						<ImageContainer>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src="/images/ecosystem-img.png" alt="" />
						</ImageContainer>
					</Grid>
					<Grid item lg={5} md={6} xs={12}>
						<BoxBgGradient bgImage="linear-gradient(126.21deg, #1470D6 0%, #1F90CF 14.24%, #125DB0 49.56%, #1470D6 93.2%)">
							<Title headingType="h3" size="xxs" className="boxTitle">
								PIG SWAP
							</Title>
							<Description size="sm" className="boxDescription">
								Decentralized exchanges (AMM - DEX) where you can trade
								conveniently
							</Description>
							<Button variant="contained" className="boxButton">
								Learn More
							</Button>
						</BoxBgGradient>
						<BoxBgGradient bgImage="linear-gradient(126.21deg, #CF1FBD 0%, #D430EF 14.24%, #A30E93 49.56%, #CF1FBD 93.2%)">
							<Title headingType="h3" size="xxs" className="boxTitle">
								PIG DAO
							</Title>
							<Description size="sm" className="boxDescription">
								You and us will be the ones to decide the development route of
								the project by Vote DAO
							</Description>
							<Button variant="contained" className="boxButton">
								Learn More
							</Button>
						</BoxBgGradient>
						<BoxBgGradient bgImage="linear-gradient(126.21deg, #6A35EE 0%, #9930EF 14.24%, #5737EE 49.56%, #795CEB 93.2%)">
							<Title headingType="h3" size="xxs" className="boxTitle">
								STAKING
							</Title>
							<Description size="sm" className="boxDescription">
								Up to 1254% APR
							</Description>
							<Button variant="contained" className="boxButton">
								Learn More
							</Button>
						</BoxBgGradient>

						<BoxBgGradient bgImage="linear-gradient(126.21deg, #1470D6 0%, #1F90CF 14.24%, #125DB0 49.56%, #1470D6 93.2%)">
							<Title headingType="h3" size="xxs" className="boxTitle">
								IRO
							</Title>
							<Description size="sm" className="boxDescription">
								Initial reference Offering: New incubator for projects on BNB
								Chain and more chain in future
							</Description>
							<Button variant="contained" className="boxButton">
								Learn More
							</Button>
						</BoxBgGradient>

						<BoxBgGradient bgImage="linear-gradient(126.21deg, #CF1FBD 0%, #D430EF 14.24%, #A30E93 49.56%, #CF1FBD 93.2%)">
							<Title headingType="h3" size="xxs" className="boxTitle">
								NFT MARKETPLACE
							</Title>
							<Description size="sm" className="boxDescription">
								100% of NFTs will be Free for initial investors. Owning the NFT
								gives you the right to vote in our autonomous economy
							</Description>
							<Button variant="contained" className="boxButton">
								Learn More
							</Button>
						</BoxBgGradient>
					</Grid>
				</Grid>
			</Container>
		</MapEcosystemContainer>
	)
}
