import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'
import { parseEther } from '@ethersproject/units'
import { NFT_METHODS } from 'constants/constants'
import { FACTORY_ADDRESS } from 'constants/networks'
import { STAKE_TOKEN_ADDRESS, STAKING_ADDRESS } from 'constants/trade'

import {
	callContract,
	callStaticContract,
	getAuctionContract,
	getERC20Contract,
	getNFTContract,
	getNFTFactoryContract,
	getStakingContract
} from '../hooks/useContract'

export const getOwnerDomains = async (
	library: Web3Provider,
	account: string
): Promise<
	{
		id: BigNumber
		tokenURI: any
	}[]
> => {
	const nftContract = getNFTContract(library)
	const balanceOf = await callContract(nftContract, NFT_METHODS.balanceOf, [
		account
	])
	const ids: BigNumber[] = await Promise.all(
		new Array(+balanceOf.toString())
			.fill('')
			.map((_, idx) =>
				callContract(nftContract, NFT_METHODS.tokenOfOwnerByIndex, [
					account,
					idx
				])
			)
	)
	const nfts = await Promise.all(
		ids.map(async (id) => {
			const tokenURI = await callContract(nftContract, NFT_METHODS.tokenURI, [
				id
			])
			return { id, tokenURI }
		})
	)
	return nfts
}

export const createFixedPrice = async (
	library: Web3Provider,
	account: string,
	nftId: BigNumber,
	price: string
) => {
	const nftContract = getNFTContract(library, account)
	await callContract(nftContract, NFT_METHODS.approve, [FACTORY_ADDRESS, nftId])
	const NFTFactory = getNFTFactoryContract(library, account)
	return callContract(NFTFactory, 'createFixedPrice', [
		nftId,
		parseEther(price.toString())
	])
}

export const createAuction = async (
	library: Web3Provider,
	account: string,
	nftId: BigNumber,
	startPrice: string,
	minBidIncrement: string,
	duration: string // days
) => {
	const nftContract = getNFTContract(library, account)
	await callContract(nftContract, NFT_METHODS.approve, [FACTORY_ADDRESS, nftId])
	const NFTFactory = getNFTFactoryContract(library, account)
	return callContract(NFTFactory, 'createAuction', [
		nftId,
		parseEther(startPrice),
		parseEther(minBidIncrement),
		+duration * 60 * 60 * 24
	])
}

export const placeBid = async (
	library: Web3Provider,
	account: string,
	auction: string,
	price: string
) => {
	const auctionContract = getAuctionContract(auction, library, account)
	await callStaticContract(auctionContract, 'placeBid', [], {
		value: parseEther(price)
	})
	return callContract(auctionContract, 'placeBid', [], {
		value: parseEther(price)
	})
}

export const cancel = async (
	library: Web3Provider,
	account: string,
	auction: string
) => {
	const auctionContract = getAuctionContract(auction, library, account)
	await callStaticContract(auctionContract, 'cancel', [])
	return callContract(auctionContract, 'cancel', [])
}

export const claim = async (
	library: Web3Provider,
	account: string,
	auction: string
) => {
	const auctionContract = getAuctionContract(auction, library, account)
	await callStaticContract(auctionContract, 'claim', [])
	return callContract(auctionContract, 'claim', [])
}

/**
 * Staking handlers
 *  */
export const getStakeInfo = async (library: Web3Provider, account: string) => {
	const stakingContract = getStakingContract(library, account)
	const [totalSupply, apr, balanceOf, pendingReward] = await Promise.all([
		callContract(stakingContract, 'totalSupply', []),
		callContract(stakingContract, 'rewardRate', []),
		callContract(stakingContract, 'balanceOf', [account]),
		callContract(stakingContract, 'pendingReward', [account])
	])
	return {
		totalSupply,
		apr,
		balanceOf,
		pendingReward
	}
}

export const stake = async (
	library: Web3Provider,
	account: string,
	amount: string
) => {
	if (!library || !account || isNaN(+amount) || +amount === 0) return
	const _amount = BigNumber.from(parseEther(amount.toString()))
	const erc20 = getERC20Contract(STAKE_TOKEN_ADDRESS, library, account)
	const allowance = await callContract(erc20, 'allowance', [
		account,
		STAKING_ADDRESS
	])
	if (allowance.lt(_amount)) {
		await callContract(erc20, 'approve', [STAKING_ADDRESS, MaxUint256])
	}
	const stakingContract = getStakingContract(library, account)
	return callContract(stakingContract, 'stake', [_amount])
}

export const claimStake = async (library: Web3Provider, account: string) => {
	if (!library || !account) return
	const stakingContract = getStakingContract(library, account)
	return callContract(stakingContract, 'claim', [])
}

export const withdrawStake = async (
	library: Web3Provider,
	account: string,
	amount: string
) => {
	if (!library || !account || isNaN(+amount) || +amount === 0) return
	const _amount = BigNumber.from(parseEther(amount))
	const stakingContract = getStakingContract(library, account)
	return callContract(stakingContract, 'withdraw', [_amount])
}
