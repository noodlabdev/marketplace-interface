import { JSBI, Percent, Token } from '@uniswap/sdk'

export interface Network {
	name: string
	chainId: number
	rpc: string[]
}

export const NETWORKS_SUPPORTED: Network = {
	name: 'Binance Smart Chain',
	chainId: 56,
	rpc: [
		'https://bsc-dataseed1.binance.org/',
		'https://bsc-dataseed1.defibit.io/',
		'https://bsc-dataseed1.ninicoin.io/'
	]
}

export const WETH: Token = new Token(
	NETWORKS_SUPPORTED.chainId,
	'0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
	18,
	'WBNB',
	'WBNB'
)

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: Token[] = [WETH]

export const CUSTOM_BASES: { [address: string]: Token[] } = {}

export const TOKEN_LIST: Token[] = [
	WETH,
	new Token(
		NETWORKS_SUPPORTED.chainId,
		'0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
		18,
		'BUSD',
		'Binance USD'
	),
	new Token(
		NETWORKS_SUPPORTED.chainId,
		'0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
		18,
		'USDC',
		'USD Coin'
	),
	new Token(
		NETWORKS_SUPPORTED.chainId,
		'0x3f1f7a4D8F17294eE1910b526296Cdf5c9bFCc7C',
		18,
		'PIP',
		'PinkPiggy'
	)
]

export const TOKEN_ICON_LIST = {
	[WETH.address]: '/tokens/wbnb.png',
	'0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56': '/tokens/busd.png',
	'0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d': '/tokens/usdc.png',
	'0x3f1f7a4D8F17294eE1910b526296Cdf5c9bFCc7C': '/logo.png'
}

export const MULTICALL_ADDRESS = '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c'

export const FACTORY_ADDRESS = '0x2f2EcA3Fd397c79a5d30eD139D9Bd833Bcab67F0'

export const ROUTER_ADDRESS = '0xfe4522163CAEE375cE631f6FE3f145811c0A6079'

export const INIT_CODE_HASH =
	'0x8cfcb207fee55354863fcdc57e6a5ba950d2a62df93278966bcdc5775e9d2cb4'

export const MASTER_CHIEF_ADDRESS = '0x18c0f49EbB3b035758bcc93f21023310B5f622f5'

// Staking
export const STAKING_ADDRESS = '0x0EB45D9007B58d6A24545B6f48E01d656b668402'
export const STAKE_TOKEN_ADDRESS = '0x8220C3FAcE5f2D578faeEF102fdF6836b9B8f042'

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
