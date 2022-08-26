import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { Web3Provider } from '@ethersproject/providers'
import { Token, TokenAmount } from '@uniswap/sdk'
import { NETWORKS_SUPPORTED, WETH } from 'constants/trade'
import { callContract, getERC20Contract } from 'hooks/useContract'
import {
	getMultipleContractMultipleData,
	getSingleContractMultipleDataMultipleMethods
} from 'utils/multicall'

export const getToken = async (
	token: string,
	library: Web3Provider | undefined
): Promise<Token | undefined> => {
	if (!library) return
	const erc20Contract = getERC20Contract(token, library)
	const erc20Methods = ['name', 'symbol', 'decimals']
	const results = await getSingleContractMultipleDataMultipleMethods(
		library,
		erc20Contract,
		erc20Methods,
		erc20Methods.map(() => [])
	)
	if (!results?.length) return
	const _token = results.reduce((memo, result, i) => {
		if (result?.[0]) memo[erc20Methods[i]] = result[0]
		return memo
	}, {})
	if (
		Array.from(new Set([...Object.keys(_token), ...erc20Methods]).values())
			.length !== erc20Methods.length
	)
		return

	return new Token(
		NETWORKS_SUPPORTED.chainId,
		token,
		_token['decimals'],
		_token['symbol'],
		_token['name']
	)
}

export const getAllowances = async (
	library: Web3Provider,
	owner: string,
	spender: string,
	tokens: (Token | undefined)[],
	amounts: (TokenAmount | undefined)[]
): Promise<Token[]> => {
	try {
		if (tokens.every((token) => !token)) return []
		const onlyTokens = tokens.filter(
			(token) => typeof token !== 'undefined' && !token.equals(WETH)
		)
		const onlyTokenAmounts = amounts.filter(
			(_, i) =>
				typeof tokens[i]?.address !== 'undefined' && !tokens?.[i]?.equals(WETH)
		)
		const erc20Contracts = onlyTokens.map((token) =>
			token?.address
				? getERC20Contract(token?.address as any, library)
				: undefined
		)
		const results = await getMultipleContractMultipleData(
			library,
			erc20Contracts,
			'allowance',
			onlyTokens.map(() => [owner, spender])
		)
		if (!results) return []
		return results.reduce((memo, result, i) => {
			const value = result?.[0]
			if (
				(value && BigNumber.from(value.toString()).eq(BigNumber.from('0'))) ||
				(typeof onlyTokenAmounts[i]?.raw?.toString() !== 'undefined' &&
					BigNumber.from(value.toString()).lt(
						BigNumber.from(onlyTokenAmounts[i]?.raw?.toString())
					))
			) {
				memo.push(onlyTokens[i])
			}
			return memo
		}, [])
	} catch (error) {
		console.log(error)
		return []
	}
}

export const approves = async (
	library: Web3Provider,
	account: string,
	spender: string,
	tokens: Token[]
): Promise<boolean> => {
	try {
		const onlyTokens = tokens.filter(
			(token) => typeof token !== 'undefined' && !token.equals(WETH)
		)
		if (!onlyTokens.length) return true
		const erc20Contracts = tokens.map((token) =>
			token?.address
				? getERC20Contract(token?.address as any, library, account)
				: undefined
		)
		await Promise.all(
			erc20Contracts.map((contract) =>
				contract
					? callContract(contract, 'approve', [spender, MaxUint256])
					: undefined
			)
		)
		return true
		// TODO research approves with multicall
		// const results = await getMultipleContractMultipleData(
		//   chainId,
		//   library,
		//   erc20Contracts,
		//   "approve",
		//   onlyTokens.map((_) => [spender, MaxUint256])
		// );
	} catch (error) {
		console.log(error)
		return true
	}
}
