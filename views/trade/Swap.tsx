import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'

import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, parseUnits } from '@ethersproject/units'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import {
	CurrencyAmount,
	Fraction,
	JSBI,
	Percent,
	Token,
	TokenAmount,
	Trade
} from '@uniswap/sdk'
import ListToken from 'components/Modal/ListToken'
import TokenIcon from 'components/TokenIcon'
import TransactionLoading from 'components/TransactionLoading'
import {
	BIPS_BASE,
	FIVE_PERCENT,
	Field,
	ROUTER_ADDRESS,
	WETH
} from 'constants/trade'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import useListTokens from 'hooks/useListTokens'
import { approves, getAllowances, getToken } from 'state/erc20'
import {
	EmptyPool,
	PoolState,
	getCurrencyBalances,
	getPoolInfo
} from 'state/liquidity'
import { getDerivedSwapInfo, swapCallback } from 'state/swap'
import styled from 'styled-components'

const Wrapper = styled.div`
	border-radius: 32px;
	box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px,
		rgb(25 19 38 / 5%) 0px 1px 1px;
	color: rgb(255, 255, 255);
	overflow: hidden;
	padding: 12px;
	.submit-btn {
		margin: 12px 0;
		background: linear-gradient(310deg, #cb7fcc 25%, #fc52ff 100%);
		padding: 12px;

		cursor: pointer;
		border-radius: 15px;
		text-align: center;
		&:hover {
			opacity: 0.8;
		}
	}
`

const HStack = styled.div`
	display: flex;
	align-items: center;
	input {
		flex: 1;
		width: 100%;
		background-color: rgba(255, 255, 255, 0.2);
		padding: 10px 12px;
		border-radius: 15px;
		border: none;
		outline: none;
		color: #fff;
		margin: 12px 0;
	}
	&.balance {
		justify-content: space-between;
	}
	.token {
		justify-content: flex-end;
		min-width: 100px;
		cursor: pointer;
		margin-left: 12px;
		&:hover {
			opacity: 0.8;
		}
		.symbol {
			margin-left: 6px;
		}
	}
`

const Center = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	.MuiSvgIcon-root {
		cursor: pointer;
		&:hover {
			opacity: 0.8;
		}
	}
`

const SpaceBetween = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 4px 0;
	.value {
		font-weight: 600;
		font-size: 14px;
	}
`

const Swap: React.FC = () => {
	const { account, library } = useActiveWeb3React()

	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	const { query } = useRouter()
	const listTokens = useListTokens()

	const [tokens, setTokens] = useState<{ [key in Field]: Token | undefined }>({
		[Field.INPUT]: WETH,
		[Field.OUTPUT]: undefined
	})
	const [balances, setBalances] = useState<
		(CurrencyAmount | undefined)[] | undefined
	>()

	const [typedValue, setTypedValue] = useState('')
	const [independentField, setIndependentField] = useState<Field>(Field.INPUT)
	const [reloadPool, setReloadPool] = useState<boolean>(false)
	const [poolInfo, setPoolInfo] = useState<PoolState>(EmptyPool)
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [tokensNeedApproved, setTokensNeedApproved] = useState<Token[]>([])
	const [trade, setTrade] = useState<Trade | null>(null)
	const [slippage, setSlippage] = useState<string>('0.5')
	const [disabledMultihops, setDisabledMultihops] = useState<boolean>(true)
	const [loadedPool, setLoadedPool] = useState<boolean>(false)
	const [isCheckedHighPriceImpact, setIsCheckedHighPriceImpact] =
		useState<boolean>(false)

	useEffect(() => {
		;(async () => {
			const { input, output } = query
			let _input = tokens[Field.INPUT],
				_output = tokens[Field.OUTPUT]
			if (
				input &&
				input.toString().toLowerCase() !== WETH.address.toLowerCase()
			) {
				const exits = listTokens.find(
					(t) => t.address.toLowerCase() === input.toString().toLowerCase()
				)
				if (exits) {
					_input = exits
				} else {
					try {
						let _t = await getToken(input.toString().toLowerCase(), library)
						if (_t) _input = _t
					} catch (error) {}
				}
			}

			if (
				output &&
				output.toString().toLowerCase() !== WETH.address.toLowerCase()
			) {
				const exits = listTokens.find(
					(t) => t.address.toLowerCase() === output.toString().toLowerCase()
				)
				if (exits) {
					_output = exits
				} else {
					try {
						let _t = await getToken(output.toString().toLowerCase(), library)
						if (_t) _output = _t
					} catch (error) {}
				}
			} else {
				_output = WETH
			}
			if (_input && _output && _input.equals(_output)) _output = undefined
			setTokens({
				[Field.INPUT]: _input,
				[Field.OUTPUT]: _output
			})
		})()
	}, [library, query, listTokens])

	useEffect(() => {
		;(async () => {
			if (!account || !library) return
			try {
				const [balances, poolInfo] = await Promise.all([
					getCurrencyBalances(account, library, [
						tokens[Field.INPUT],
						tokens[Field.OUTPUT]
					]),
					getPoolInfo(account, library, [
						tokens[Field.INPUT],
						tokens[Field.OUTPUT]
					])
				])
				poolInfo && setPoolInfo(poolInfo)
				balances && setBalances(balances)
			} catch (error) {
				console.error(error)
			}
		})()
	}, [account, library, tokens, reloadPool])

	useEffect(() => {
		;(async () => {
			try {
				if (!account) return
				setLoadedPool(false)
				const trade = await getDerivedSwapInfo({
					library,
					independentField,
					typedValue,
					currencies: tokens,
					singlehops: disabledMultihops
				})
				setTrade(trade)
				setLoadedPool(true)
			} catch (error) {
				setLoadedPool(false)
				console.error(error)
			}
		})()
	}, [
		account,
		library,
		tokens,
		typedValue,
		independentField,
		disabledMultihops
	])

	useEffect(() => {
		if (!account || !library || !trade || !tokens[Field.INPUT] || !typedValue)
			return

		const decimals = tokens[Field.INPUT]?.decimals ?? 18
		const parsedAmount = new Fraction(
			parseUnits(typedValue, decimals).toString()
		)
		const inputAmount: TokenAmount =
			independentField === Field.INPUT
				? new TokenAmount(
						tokens?.[Field.INPUT] as any,
						parsedAmount.quotient.toString()
				  )
				: (trade.inputAmount as TokenAmount)
		getAllowances(
			library,
			account,
			ROUTER_ADDRESS,
			[tokens[Field.INPUT]],
			[inputAmount]
		)
			.then(setTokensNeedApproved)
			.catch(console.error)
	}, [account, library, trade, tokens, independentField, typedValue])

	const handleOpenModal = (independentField: Field) => {
		setIndependentField(independentField)
		handleOpen()
	}

	const handleSelectToken = (token: Token) => {
		let _tokens = { ...tokens }
		_tokens[independentField] = token
		if (independentField === Field.INPUT) {
			if (tokens[Field.OUTPUT] && token.equals(tokens[Field.OUTPUT] as any)) {
				if (tokens[Field.INPUT]) _tokens[Field.OUTPUT] = tokens[Field.INPUT]
				else _tokens[Field.OUTPUT] = undefined
			}
		} else {
			if (tokens[Field.INPUT] && token.equals(tokens[Field.INPUT] as any)) {
				if (tokens[Field.OUTPUT]) _tokens[Field.INPUT] = tokens[Field.OUTPUT]
				else _tokens[Field.INPUT] = undefined
			}
		}
		setTokens(_tokens)
		handleClose()
	}

	const handleChangeAmounts = (value: string, independentField: Field) => {
		if (isNaN(+value)) return
		setTypedValue(value)
		setIndependentField(independentField)
	}

	const isDisableBtn: boolean = useMemo(() => {
		if (!trade || !balances?.[0] || !tokens[Field.INPUT] || !typedValue)
			return true
		let input =
			independentField === Field.INPUT
				? parseUnits(typedValue, tokens[Field.INPUT]?.decimals).toString()
				: trade.inputAmount.raw.toString()

		if (
			BigNumber.from(input).gt(
				BigNumber.from(balances[0]?.raw.toString() ?? '0')
			)
		) {
			return true
		}
		return false
	}, [trade, balances])

	const isNeedApproved: boolean = useMemo(
		() => (tokensNeedApproved.length > 0 ? true : false),
		[tokensNeedApproved]
	)

	const onSwapCallback = useCallback(async () => {
		try {
			setSubmitting(true)
			await swapCallback(library, account, trade, +slippage)
			setReloadPool((pre) => !pre)
			alert('Swap success')
			setSubmitting(false)
		} catch (error) {
			console.error(error)
			setSubmitting(false)
		}
	}, [account, library, trade, slippage])

	const onApproveTokens = useCallback(async () => {
		try {
			if (!account || !library) return
			setSubmitting(true)
			const result = await approves(
				library,
				account,
				ROUTER_ADDRESS,
				tokensNeedApproved
			)
			if (result) setTokensNeedApproved([])
			alert('Approve success')
			setSubmitting(false)
		} catch (error: any) {
			console.error(error)

			setSubmitting(false)
		}
	}, [account, library, tokensNeedApproved])

	const isHighPriceImpact = useMemo(
		() => (trade ? trade.priceImpact.greaterThan(FIVE_PERCENT) : false),
		[trade]
	)

	const onSubmit = () => {
		// if (isHighPriceImpact) return onOpenConfirmHighSlippage();
		if (isNeedApproved) {
			return onApproveTokens()
		} else if (!isDisableBtn) {
			return onSwapCallback()
		}
	}

	const onSubmitHighSlippage = () => {
		if (isNeedApproved) {
			return onApproveTokens()
		} else if (!isDisableBtn) {
			return onSwapCallback()
			// .then(handleCloseConfirmHighSlippage);
		}
	}

	const buttonText = useMemo((): string => {
		if (!account) return 'Connect wallet'
		if (
			!loadedPool ||
			!tokens[Field.INPUT] ||
			!tokens[Field.OUTPUT] ||
			!balances ||
			!balances[0] ||
			!balances[1]
		)
			return 'Swap'

		if (!trade) {
			if (poolInfo.pair) return 'Swap'
			else return 'No route'
		} else {
			let input =
				independentField === Field.INPUT
					? parseUnits(typedValue, tokens[Field.INPUT]?.decimals).toString()
					: trade.inputAmount.raw.toString()

			if (
				BigNumber.from(input).gt(
					BigNumber.from(balances[0]?.raw.toString() ?? '0')
				)
			) {
				return `Insufficient ${tokens[Field.INPUT]?.symbol} balance`
			}
			if (poolInfo.noLiquidity && poolInfo.pair) return 'No liquidity'
			else if (isNeedApproved) return 'Approve token'
		}
		return 'Swap'
	}, [loadedPool, tokens, trade, poolInfo, isNeedApproved, account])

	return (
		<Wrapper>
			<TransactionLoading loading={submitting} />
			<ListToken
				open={open}
				handleClose={handleClose}
				callback={handleSelectToken}
			/>
			<div>
				<HStack className="balance">
					<div>From </div>
					<div>Balance: {balances?.[0]?.toSignificant(6) ?? 0} </div>
				</HStack>
				<HStack>
					<input
						value={
							independentField === Field.INPUT
								? typedValue
								: trade?.inputAmount.toSignificant(6) ?? ''
						}
						onChange={(e) => handleChangeAmounts(e.target.value, Field.INPUT)}
					/>
					<HStack
						className="token"
						onClick={() => handleOpenModal(Field.INPUT)}>
						<TokenIcon token={tokens[Field.INPUT]} />
						<div className="symbol">{tokens[Field.INPUT]?.symbol ?? '---'}</div>
						<ArrowDropDownIcon />
					</HStack>
				</HStack>
			</div>
			<Center>
				<SwapVertIcon
					onClick={() => {
						const [_input, _output] = [
							tokens[Field.INPUT],
							tokens[Field.OUTPUT]
						]
						setTokens({
							[Field.INPUT]: _output,
							[Field.OUTPUT]: _input
						})
					}}
				/>
			</Center>

			<div>
				<HStack className="balance">
					<div>To </div>
					<div>Balance: {balances?.[1]?.toSignificant(6) ?? 0} </div>
				</HStack>
				<HStack>
					<input
						value={
							independentField === Field.OUTPUT
								? typedValue
								: trade?.outputAmount.toSignificant(6) ?? ''
						}
						onChange={(e) => handleChangeAmounts(e.target.value, Field.OUTPUT)}
					/>
					<HStack
						className="token"
						onClick={() => handleOpenModal(Field.OUTPUT)}>
						<TokenIcon token={tokens[Field.OUTPUT]} />
						<div className="symbol">
							{tokens[Field.OUTPUT]?.symbol ?? '---'}
						</div>
						<ArrowDropDownIcon />
					</HStack>
				</HStack>
			</div>

			{trade && (
				<SpaceBetween>
					<div>Price</div>
					<HStack className="value">
						<div>{trade?.executionPrice.toSignificant(6)} </div>
						<div style={{ marginLeft: '4px' }}>
							{tokens[Field.OUTPUT]?.symbol} / {tokens[Field.INPUT]?.symbol}
						</div>
					</HStack>
				</SpaceBetween>
			)}

			<div onClick={onSubmit} className="submit-btn">
				{buttonText}
			</div>

			{trade && (
				<div>
					<SpaceBetween>
						<div>Price Impact</div>
						<div className="value">{trade.priceImpact.toSignificant(6)}%</div>
					</SpaceBetween>
					<SpaceBetween>
						<div>
							{slippage
								? independentField === Field.INPUT
									? 'Minimum received'
									: 'Maximum sent'
								: ''}
						</div>
						<div className="value">
							{slippage
								? independentField === Field.INPUT
									? trade
											.minimumAmountOut(
												new Percent(JSBI.BigInt(+slippage * 100), BIPS_BASE)
											)
											.toSignificant(6)
									: trade
											.maximumAmountIn(
												new Percent(JSBI.BigInt(+slippage * 100), BIPS_BASE)
											)
											.toSignificant(6)
								: ''}
						</div>
					</SpaceBetween>
					<SpaceBetween>
						<div>Liquidity Provider Fee</div>
						<div className="value">
							{parseFloat(
								formatEther(
									BigNumber.from(trade.inputAmount.raw.toString())
										.mul(BigNumber.from('3'))
										.div(BigNumber.from('100'))
								)
							).toFixed(4)}{' '}
							{trade.route.input.symbol}
						</div>
					</SpaceBetween>
					<SpaceBetween>
						<div>Route</div>
						<div className="value">
							{trade?.route.path.map((t) => t.symbol).join(' > ')}
						</div>
					</SpaceBetween>
				</div>
			)}
		</Wrapper>
	)
}

export default Swap
