import { MouseEventHandler } from 'react'

import { ButtonProps } from '@mui/material'

import DomainCard from './DomainCard'

export interface NFT {
	id: string
	nftURI: string
	sale?: string
	owner?: string
	ownerSale?: string
}

export interface DomainCardProps {
	onClickContainer?: MouseEventHandler<HTMLDivElement>
	domain: {
		id: string
		nft: NFT
		start: number
		end?: number
		hightestBid: string
		highestBidder: string
	}
	buttonProps?: Omit<ButtonProps, 'variant' | 'fullWidth'>
	_refetch?: () => any
}

export { DomainCard }
