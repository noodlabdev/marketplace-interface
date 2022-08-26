import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import ERC20ABI from 'abis/ERC20.json'
import FactoryABI from 'abis/Factory.json'
import PairABI from 'abis/Pair.json'
import RouterABI from 'abis/Router.json'
import { FACTORY_ADDRESS, ROUTER_ADDRESS } from 'constants/trade'

import AuctionABI from '../abis/Auction.json'
import IERC721 from '../abis/IERC721.json'
import MulticallABI from '../abis/Multicall2.json'
import NFTFactoryABI from '../abis/NFTFactory.json'
import {
	MULTICALL_ADDRESS,
	NFT_ADDRESS,
	FACTORY_ADDRESS as NFT_FACTORY_ADDRESS
} from '../constants/networks'
import { getContract, isAddress } from '../utils'

export async function callContract(
	contract: Contract,
	method: string,
	args: any[],
	overrides: { [key: string]: any } = {}
) {
	const tx = await contract[method](...args, {
		...overrides
	})
	if (typeof tx.wait !== 'function') return tx
	const res = await tx.wait()
	return res
}

export async function callStaticContract(
	contract: Contract,
	method: string,
	args: any[],
	overrides: { [key: string]: any } = {}
) {
	return contract.callStatic[method](...args, {
		...overrides
	})
}

export function getMulticallContract(library: Web3Provider, account?: string) {
	return getContract(MULTICALL_ADDRESS, MulticallABI, library, account)
}

export function getNFTContract(library: Web3Provider, account?: string) {
	return getContract(NFT_ADDRESS, IERC721, library, account)
}

export function getNFTFactoryContract(library: Web3Provider, account?: string) {
	return getContract(NFT_FACTORY_ADDRESS, NFTFactoryABI, library, account)
}

export function getAuctionContract(
	auction: string,
	library: Web3Provider,
	account?: string
) {
	return getContract(auction, AuctionABI, library, account)
}

export function getFixedPriceContract(
	fixed: string,
	library: Web3Provider,
	account?: string
) {
	return getContract(fixed, AuctionABI, library, account)
}

export function getERC20Contract(
	token: string,
	library: Web3Provider,
	account?: string
): Contract {
	if (!isAddress(token)) throw Error('invalid token address')
	return getContract(token, ERC20ABI, library, account)
}

export function getPairContract(
	pair: string,
	library: Web3Provider,
	account?: string
) {
	if (!isAddress(pair)) throw Error('invalid pair address')
	return getContract(pair, PairABI, library, account)
}

export function getFactoryContract(library: Web3Provider, account?: string) {
	return getContract(FACTORY_ADDRESS, FactoryABI, library, account)
}

export function getRouterContract(library: Web3Provider, account?: string) {
	return getContract(ROUTER_ADDRESS, RouterABI, library, account)
}
