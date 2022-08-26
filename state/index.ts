import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import {
	CurrencyAmount,
	JSBI,
	Pair,
	Percent,
	Token,
	TokenAmount,
	Trade,
	currencyEquals
} from '@uniswap/sdk'
import {
	BASES_TO_CHECK_TRADES_AGAINST,
	BETTER_TRADE_LESS_HOPS_THRESHOLD,
	CUSTOM_BASES,
	FACTORY_ADDRESS,
	MAX_TRADE_HOPS,
	ONE_HUNDRED_PERCENT,
	ZERO_PERCENT
} from 'constants/trade'
import {
	getERC20Contract,
	getMulticallContract,
	getPairContract
} from 'hooks/useContract'
import flatMap from 'lodash/flatMap'

import {
	computePairAddress,
	isAddress,
	removeNumericKey,
	wrappedCurrency
} from '../utils'
import {
	getMultipleContractMultipleData,
	getSingleContractMultipleData,
	getSingleContractMultipleDataMultipleMethods
} from '../utils/multicall'

/**
 * Returns a map of the given addresses to their eventually consistent BNB balances.
 */
export const getBNBBalances = async (
	library: Web3Provider,
	uncheckedAddresses?: (string | undefined | null)[]
): Promise<{
	[address: string]: CurrencyAmount | undefined
}> => {
	const multicallContract = await getMulticallContract(library)
	const addresses: string[] = uncheckedAddresses
		? uncheckedAddresses
				.map(isAddress)
				.filter((a): a is string => a !== false)
				.sort()
		: []
	const results = await getSingleContractMultipleData(
		library,
		multicallContract,
		'getEthBalance',
		addresses.map((address) => [address])
	)
	return addresses.reduce<{ [address: string]: CurrencyAmount }>(
		(memo, address, i) => {
			const value = results?.[i]
			if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value + ''))
			return memo
		},
		{}
	)
}

/**
 * Returns a map of the given addresses to their eventually consistent token balances.
 */
export const getTokenBalances = async (
	account: string,
	library: Web3Provider,
	tokens: Token[]
): Promise<{
	[address: string]: TokenAmount | undefined
}> => {
	const tokenContracts = tokens.map((token) =>
		getERC20Contract(token.address, library)
	)
	const results = await getMultipleContractMultipleData(
		library,
		tokenContracts,
		'balanceOf',
		tokenContracts.map(() => [account])
	)

	return tokens.reduce<{ [address: string]: TokenAmount }>((memo, token, i) => {
		const value = results?.[i][0]
		if (value)
			memo[token.address] = new TokenAmount(token, JSBI.BigInt(value + ''))
		return memo
	}, {})
}

/**
 * Returns pair info
 */
export const getPairInfo = async (
	library: Web3Provider,
	account: string,
	pairContract: Contract
) => {
	try {
		const methodNames = [
			'token0',
			'token1',
			'getReserves',
			'balanceOf',
			'totalSupply'
		]
		const results = await getSingleContractMultipleDataMultipleMethods(
			library,
			pairContract,
			methodNames,
			[[], [], [], [account], []]
		)
		return methodNames.reduce<{ [address: string]: any }>((memo, method, i) => {
			const value = results?.[i][0]
			// console.log("value + ", value + "");
			if (value) {
				if (i !== 2) memo[method] = value + ''
				else memo = { ...memo, ...removeNumericKey(results[i]) }
			}
			return memo
		}, {})
	} catch (error) {
		console.log(error)
		return undefined
	}
}

export enum PairState {
	LOADING = 0,
	NOT_EXISTS = 1,
	EXISTS = 2,
	INVALID = 3
}

export const getPairs = async (
	library: Web3Provider,
	currencies: Token[][]
) => {
	const tokens = currencies.map(([currencyA, currencyB]) => [
		wrappedCurrency(currencyA),
		wrappedCurrency(currencyB)
	])

	const pairAddresses = tokens.map(([tokenA, tokenB]) => {
		return tokenA && tokenB && !tokenA.equals(tokenB)
			? computePairAddress({
					factoryAddress: FACTORY_ADDRESS,
					tokenA,
					tokenB
			  })
			: undefined // eslint-disable-line prettier/prettier
	})
	const pairContracts = pairAddresses
		.filter((pair) => !!pair)
		.map((pair) => getPairContract(pair as string, library))

	const results = await getMultipleContractMultipleData(
		library,
		pairContracts,
		'getReserves',
		pairContracts.map((_) => []) // eslint-disable-line  @typescript-eslint/no-unused-vars
	)

	if (!results) return []

	return results.map((reserves, i) => {
		const tokenA: any = tokens[i][0]
		const tokenB = tokens[i][1]
		if (!tokenA || !tokenB || tokenA.equals(tokenB))
			return [PairState.INVALID, null]
		if (!reserves) return [PairState.NOT_EXISTS, null]
		const { reserve0, reserve1 } = reserves
		const [token0, token1] = tokenA.sortsBefore(tokenB)
			? [tokenA, tokenB]
			: [tokenB, tokenA]
		return [
			PairState.EXISTS,
			new Pair(
				new TokenAmount(token0, reserve0.toString()),
				new TokenAmount(token1, reserve1.toString())
			)
		]
	})
}

export const getAllCommonPairs = async (
	library: Web3Provider | null | undefined,
	currencyA: Token | undefined,
	currencyB: Token | undefined
): Promise<Pair[]> => {
	if (!library) return []
	const [tokenA, tokenB] = [
		// wrappedCurrency(currencyA),
		// wrappedCurrency(currencyB),
		currencyA,
		currencyB
	]
	if (!tokenA || !tokenB) return []

	const bases = BASES_TO_CHECK_TRADES_AGAINST
		? BASES_TO_CHECK_TRADES_AGAINST
		: []

	const basePairs = flatMap(bases, (base) =>
		bases.map((otherBase) => [base, otherBase])
	).filter(([t0, t1]) => t0.address !== t1.address)

	const allPairCombinations: Token[][] =
		tokenA && tokenB
			? [
					// the direct pair
					[tokenA, tokenB],
					// token A against all bases
					...bases.map((base): [Token, Token] => [tokenA, base]),
					// token B against all bases
					...bases.map((base): [Token, Token] => [tokenB, base]),
					// each base against all bases
					...basePairs
			  ] // eslint-disable-line prettier/prettier
					.filter((tokens) => Boolean(tokens[0] && tokens[1]))
					.filter(([t0, t1]) => t0.address !== t1.address)
					.filter(([tokenA, tokenB]) => {
						const customBases = CUSTOM_BASES
						if (!customBases) return true

						const customBasesA = customBases[tokenA.address]
						const customBasesB = customBases[tokenB.address]

						if (!customBasesA && !customBasesB) return true

						if (
							customBasesA &&
							!customBasesA.find((base) => tokenB.equals(base))
						)
							return false
						if (
							customBasesB &&
							!customBasesB.find((base) => tokenA.equals(base))
						)
							return false

						return true
					})
			: [] // eslint-disable-line prettier/prettier

	const allPairs = await getPairs(library, allPairCombinations)

	return Object.values(
		allPairs
			// filter out invalid pairs
			.filter((result): result is [PairState.EXISTS, Pair] =>
				Boolean(result[0] === PairState.EXISTS && result[1])
			)
			// filter out duplicated pairs
			.reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
				memo[curr.liquidityToken.address] =
					memo[curr.liquidityToken.address] ?? curr
				return memo
			}, {})
	)
}

// returns whether tradeB is better than tradeA by at least a threshold percentage amount
export function isTradeBetter(
	tradeA: Trade | undefined | null,
	tradeB: Trade | undefined | null,
	minimumDelta: Percent = ZERO_PERCENT
): boolean | undefined {
	if (tradeA && !tradeB) return false
	if (tradeB && !tradeA) return true
	if (!tradeA || !tradeB) return undefined

	if (
		tradeA.tradeType !== tradeB.tradeType ||
		!currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
		!currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency)
	) {
		throw new Error('Trades are not comparable')
	}

	if (minimumDelta.equalTo(ZERO_PERCENT)) {
		return tradeA.executionPrice.lessThan(tradeB.executionPrice)
	}
	return tradeA.executionPrice.raw
		.multiply(minimumDelta.add(ONE_HUNDRED_PERCENT))
		.lessThan(tradeB.executionPrice)
}

export const getTradeExactIn = async (
	library: Web3Provider,
	currencyA: Token,
	currencyB: Token,
	currencyAmountIn: TokenAmount | CurrencyAmount,
	currencyOut: Token,
	singleHopOnly: boolean = true // eslint-disable-line @typescript-eslint/no-inferrable-types
): Promise<Trade | null> => {
	// // eslint-disable-line prettier/prettier
	const allowedPairs = await getAllCommonPairs(library, currencyA, currencyB)
	if (!allowedPairs.length) return null

	if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
		if (singleHopOnly) {
			return (
				Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
					maxHops: 1,
					maxNumResults: 1
				})[0] ?? null
			)
		}
		// search through trades with varying hops, find best trade out of them
		let bestTradeSoFar = null
		for (let i = 1; i <= MAX_TRADE_HOPS; i++) {
			const currentTrade =
				Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
					maxHops: i,
					maxNumResults: 1
				})[0] ?? null
			// if current trade is best yet, save it
			if (
				isTradeBetter(
					bestTradeSoFar,
					currentTrade,
					BETTER_TRADE_LESS_HOPS_THRESHOLD
				)
			) {
				bestTradeSoFar = currentTrade
			}
		}
		return bestTradeSoFar
	}
	return null
}

export const getTradeExactOut = async (
	library: Web3Provider,
	currencyA: Token,
	currencyB: Token,
	currencyAmountOut: TokenAmount | CurrencyAmount,
	currencyIn: Token,
	singleHopOnly: boolean
): Promise<Trade | null> => {
	const allowedPairs = await getAllCommonPairs(library, currencyA, currencyB)
	if (!allowedPairs.length) return null

	if (currencyAmountOut && currencyIn && allowedPairs.length > 0) {
		if (singleHopOnly) {
			return (
				Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
					maxHops: 1,
					maxNumResults: 1
				})[0] ?? null
			)
		}
		// search through trades with varying hops, find best trade out of them
		let bestTradeSoFar = null
		for (let i = 1; i <= MAX_TRADE_HOPS; i++) {
			const currentTrade =
				Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
					maxHops: i,
					maxNumResults: 1
				})[0] ?? null
			// if current trade is best yet, save it
			if (
				isTradeBetter(
					bestTradeSoFar,
					currentTrade,
					BETTER_TRADE_LESS_HOPS_THRESHOLD
				)
			) {
				bestTradeSoFar = currentTrade
			}
		}
		return bestTradeSoFar
	}
	return null
}
