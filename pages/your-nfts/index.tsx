import type { NextPage } from 'next'
import Image from 'next/image'

import { useQuery } from '@apollo/client'
import { Container, Grid } from '@mui/material'
import { Title } from 'components'
import {
	YourDomainCard,
	YourNFTCardProps
} from 'components/Card/YourDomainCard'
import TransactionLoading from 'components/TransactionLoading'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { GET_YOUR_NFT } from 'services/apollo/queries'
import styled from 'styled-components'
import { BgMatrixRight, Section } from 'styles'

const TitleCenter = styled(Title)`
	text-align: center;
	margin-bottom: 40px;
	@media screen and (max-width: 1700px) {
		margin-bottom: 40px;
	}
	@media screen and (max-width: 1400px) {
		margin-bottom: 34px;
	}
	@media screen and (max-width: 900px) {
		margin-bottom: 22px;
	}
`
const BgMatrixRightCustom = styled(BgMatrixRight)`
	min-height: calc(100vh - 316px);
`

const SorryContainer = styled.div`
	padding: 40px 0;
	text-align: center;
	& > .sorry-img {
		position: relative;
		width: auto;
		height: 300px;
	}
	& > .sorry-title {
		max-width: 50%;
		margin: 40px auto 0;
	}
	@media screen and (max-width: 1700px) {
		padding: 20px 0;
		& > .sorry-img {
			height: 260px;
		}
	}
	@media screen and (max-width: 1400px) {
		& > .sorry-img {
			height: 220px;
		}
		& > .sorry-title {
			max-width: 40%;
		}
	}
	@media screen and (max-width: 900px) {
		& > .sorry-img {
			height: 200px;
		}
		& > .sorry-title {
			margin-top: 30px;
			max-width: 53%;
		}
	}
	@media screen and (max-width: 500px) {
		& > .sorry-img {
			height: 180px;
		}
		& > .sorry-title {
			max-width: 80%;
		}
	}
`

const YourDomain: NextPage = () => {
	const { account } = useActiveWeb3React()

	const { loading, error, data, refetch } = useQuery(GET_YOUR_NFT, {
		variables: { account },
		pollInterval: 6000
	})

	if (loading) return <TransactionLoading loading={true} />
	if (error) return <div>Error fetch subgraphs</div>

	return (
		<>
			<BgMatrixRightCustom>
				<Section>
					<Container>
						{data.nfts.length ? (
							<>
								<TitleCenter
									size="md"
									headingType="h4"
									className="your-domain-title">
									Your NFT
								</TitleCenter>
								<Grid
									container
									columns={12}
									justifyContent="center"
									spacing={4}>
									{data.nfts.map((nft: YourNFTCardProps, index?: number) => (
										<Grid item xl={3} lg={4} md={6} sm={6} xs={12} key={index}>
											<YourDomainCard nft={nft} _refetch={refetch} />
										</Grid>
									))}
								</Grid>
								{/* <ButtonMainWrap>
									<ButtonMain variant="contained" size="medium">
										Save
									</ButtonMain>
								</ButtonMainWrap> */}
							</>
						) : (
							<SorryContainer>
								<div className="sorry-img">
									<Image
										priority
										src="/images/your-domain-state-2.png"
										alt="Logo"
										layout="fill"
										objectFit="contain"
										objectPosition="center center"
									/>
								</div>
								<TitleCenter className="sorry-title">
									You don’t have any NFT yet
								</TitleCenter>
								{/* <ButtonMainWrap className="sorry-btn-wrap">
									<ButtonMain
										className="sorry-btn"
										variant="contained"
										size="large">
										Get your First Domain
									</ButtonMain>
								</ButtonMainWrap> */}
							</SorryContainer>
						)}
					</Container>
				</Section>
			</BgMatrixRightCustom>
		</>
	)
}

export async function getStaticProps() {
	return {
		props: {
			title: 'Your Domain',
			description: 'This is a description for Your Domain page'
		}
	}
}

export default YourDomain
