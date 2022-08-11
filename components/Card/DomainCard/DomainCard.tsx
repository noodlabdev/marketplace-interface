import { FC } from 'react'

import Image from 'next/image'

import { formatEther } from '@ethersproject/units'
import { SALE } from 'constants/constants'
import { NATIVE_COIN } from 'constants/networks'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import styled from 'styled-components'
import { cancel, placeBid } from 'utils/callContract'

import { DomainCardProps } from '.'
import {
	DomainCardButton,
	DomainCardCancelButton,
	DomainCardContainer,
	DomainCardName
} from './DomainCard.styled'

export const OnSaleWrap = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	margin: 20px 0 0 0;
	.MuiButtonBase-root {
		flex: 1;
		margin: 0 16px;
	}
	@media screen and (max-width: 1700px) {
	}
	@media screen and (max-width: 1400px) {
	}
	@media screen and (max-width: 900px) {
		justify-content: center;
	}
	@media screen and (max-width: 500px) {
	}
`

const DomainCard: FC<DomainCardProps> = ({
	domain,
	onClickContainer,
	buttonProps,
	...restProps
}) => {
	const { account, library } = useActiveWeb3React()

	const handleBid = async () => {
		if (!library || !account) return alert('Please connect wallet')
		if (!domain.id || !domain.nft || !domain.hightestBid)
			return alert('Invalid NFT')
		let price: any = formatEther(domain.hightestBid)
		let message = 'Buy success'
		if (domain.nft.sale == SALE.AUCTION) {
			price = prompt('enter price')
			message = 'Bid success'
			if (!price) return
		}
		try {
			await placeBid(library, account, domain.id, price)
			restProps._refetch && restProps._refetch()
			alert(message)
		} catch (error: any) {
			error.reason ? alert(error.reason) : alert('ERROR')
		}
	}

	const handleCancel = async () => {
		if (!account || !library) return alert('connect wallet before')

		try {
			await cancel(library, account, domain.id)
			restProps._refetch && restProps._refetch()
			alert('Cancel success')
		} catch (error: any) {
			error.reason ? alert(error.reason) : alert('ERROR')
		}
	}

	return (
		<DomainCardContainer onClick={onClickContainer} {...restProps}>
			{domain.nft && (
				<>
					<Image
						src={domain.nft.nftURI}
						alt="nft"
						height={400}
						width={400}
						layout="responsive"
					/>
					<DomainCardName>ID: {domain.nft.id}</DomainCardName>
					{domain.end && (
						<div>
							<DomainCardName>
								Highest Bid {formatEther(domain.hightestBid)}{' '}
								{NATIVE_COIN.symbol}
							</DomainCardName>
							<DomainCardName>
								Bidder {''}
								{`${domain.highestBidder.slice(
									0,
									6
								)}...${domain.highestBidder.slice(
									domain.highestBidder.length - 5,
									domain.highestBidder.length
								)}`}
							</DomainCardName>
							<DomainCardName>Min Increment</DomainCardName>
						</div>
					)}
				</>
			)}

			{buttonProps && (
				<DomainCardButton
					variant="contained"
					fullWidth
					{...buttonProps}
					onClick={handleBid}
				/>
			)}
			<OnSaleWrap>
				{domain.nft.ownerSale === account?.toLowerCase() && (
					<>
						{/* {!domain.end && (
							<DomainCardChangeButton
								variant="contained"
								fullWidth
								children="Change"
								onClick={handleCancel}
							/>
						)} */}
						<DomainCardCancelButton
							variant="contained"
							fullWidth
							children="Cancel" // eslint-disable-line react/no-children-prop
							onClick={handleCancel}
						/>
					</>
				)}
			</OnSaleWrap>
		</DomainCardContainer>
	)
}

export default DomainCard
