import { JSBI, Percent, Token } from '@uniswap/sdk'

export interface Network {
	name: string
	chainId: number
	rpc: string[]
}

export const NETWORKS_SUPPORTED: Network = {
	name: 'Rinkeby Testnet',
	chainId: 4,
	rpc: ['https://rinkeby.infura.io/v3/d5a3ddc7c4b24c3a9966616bdf77945e']
}

export const WETH: Token = new Token(
	NETWORKS_SUPPORTED.chainId,
	'0xc778417E063141139Fce010982780140Aa0cD5Ab',
	18,
	'WETH',
	'WETH'
)

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: Token[] = [WETH]

export const CUSTOM_BASES: { [address: string]: Token[] } = {}

export const TOKEN_LIST: Token[] = [
	WETH,
	new Token(
		NETWORKS_SUPPORTED.chainId,
		'0xC6EC509B91d80A6dD58aC23Df2eAB83fC6585d42',
		18,
		'USDC',
		'USDC'
	),
	new Token(
		NETWORKS_SUPPORTED.chainId,
		'0x1305b5BbD5A18456FF0Bf32Ce50f1B40987da6eB',
		18,
		'DAI',
		'DAI'
	),
	new Token(
		NETWORKS_SUPPORTED.chainId,
		'0xa9b379E408413dbb8805aeEb7250173df74b955e',
		18,
		'USDT',
		'USDT'
	)
]

export const MULTICALL_ADDRESS = '0x5ba1e12693dc8f9c48aad8770482f4739beed696'

export const FACTORY_ADDRESS = '0x216d68BE9A68c18984Bf79192a817569E24Ef50f'

export const ROUTER_ADDRESS = '0xB06674180C3342fF55b4732aBc2F1D2c29cF95A0'

export const INIT_CODE_HASH =
	'0x83848be097e476754448147144a11610b2ab21ce3ff956deb1b81478a9ed9cea'

export const MASTER_CHIEF_ADDRESS = '0x18c0f49EbB3b035758bcc93f21023310B5f622f5'

export enum Field {
	INPUT = 'INPUT',
	OUTPUT = 'OUTPUT'
}

export const MAX_TRADE_HOPS = 3

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(
	JSBI.BigInt(50),
	JSBI.BigInt(10000)
)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
export const FIVE_PERCENT = new Percent(JSBI.BigInt(5), JSBI.BigInt(100))
export const SWAP_FEE_PERCENT = new Percent(JSBI.BigInt(97), JSBI.BigInt(100))

export const BIPS_BASE = JSBI.BigInt(10000)

export const BUNDLE_ID = '1'

export const timeframeOptions = {
	WEEK: '1 week',
	MONTH: '1 month',
	// THREE_MONTHS: '3 months',
	// YEAR: '1 year',
	HALF_YEAR: '6 months',
	ALL_TIME: 'All time'
}

// token list urls to fetch tokens from - use for warnings on tokens and pairs
export const SUPPORTED_LIST_URLS__NO_ENS = [
	'https://gateway.ipfs.io/ipns/tokens.uniswap.org',
	'https://www.coingecko.com/tokens_list/uniswap/defi_100/v_0_0_0.json'
]

// hide from overview list
export const TOKEN_BLACKLIST: any[] = []

// pair blacklist
export const PAIR_BLACKLIST: any[] = []

// warnings to display if page contains info about blocked token
export const BLOCKED_WARNINGS = {
	'0xf4eda77f0b455a12f3eb44f8653835f377e36b76':
		'TikTok Inc. has asserted this token is violating its trademarks and therefore is not available.'
}

/**
 * For tokens that cause erros on fee calculations
 */
export const FEE_WARNING_TOKENS = []

export const UNTRACKED_COPY =
	'Derived USD values may be inaccurate without liquid stablecoin or ETH pairings.'

// pairs that should be tracked but arent due to lag in subgraph
export const TRACKED_OVERRIDES_PAIRS = []

// tokens that should be tracked but arent due to lag in subgraph
// all pairs that include token will be tracked
export const TRACKED_OVERRIDES_TOKENS = []
