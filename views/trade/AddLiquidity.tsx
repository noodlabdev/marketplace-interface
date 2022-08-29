import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'

import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'
import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { CurrencyAmount, Fraction, Token, TokenAmount } from '@uniswap/sdk'
import ListToken from 'components/Modal/ListToken'
import TokenIcon from 'components/TokenIcon'
import TransactionLoading from 'components/TransactionLoading'
// import ListTokensModal from "@/components/ListTokensModal";
import { Field, ROUTER_ADDRESS, WETH } from 'constants/trade'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import useListTokens from 'hooks/useListTokens'
import { approves, getAllowances, getToken } from 'state/erc20'
import {
	EmptyPool,
	PoolState,
	addLiquidityCallback,
	getCurrencyBalances,
	getPoolInfo
} from 'state/liquidity'
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

const AddLiquidity: React.FC = () => {
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	const { account, library } = useActiveWeb3React()
	const router = useRouter()
	const listTokens = useListTokens()

	const [tokens, setTokens] = useState<{ [key in Field]: Token | undefined }>({
		[Field.INPUT]: WETH,
		[Field.OUTPUT]: undefined
	})
	const [balances, setBalances] = useState<
		(CurrencyAmount | undefined)[] | undefined
	>()
	const [tokenAmounts, setTokenAmounts] = useState<{ [key in Field]: string }>({
		[Field.INPUT]: '',
		[Field.OUTPUT]: ''
	})
	const [parsedTokenAmounts, setParsedTokenAmounts] = useState<{
		[key in Field]: TokenAmount | undefined
	}>({
		[Field.INPUT]: undefined,
		[Field.OUTPUT]: undefined
	})
	const [independentField, setIndependentField] = useState<Field>(Field.INPUT)
	const [reloadPool, setReloadPool] = useState<boolean>(false)
	const [poolInfo, setPoolInfo] = useState<PoolState>(EmptyPool)
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [typePrice, setTypePrice] = useState<Field>(Field.INPUT)
	const [tokensNeedApproved, setTokensNeedApproved] = useState<Token[]>([])

	useEffect(() => {
		;(async () => {
			const { input, output } = router.query
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
	}, [library, router, listTokens])

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
		if (!account || !library) return
		getAllowances(
			library,
			account,
			ROUTER_ADDRESS,
			[tokens[Field.INPUT], tokens[Field.OUTPUT]],
			[parsedTokenAmounts[Field.INPUT], parsedTokenAmounts[Field.OUTPUT]]
		)
			.then(setTokensNeedApproved)
			.catch(console.error)
	}, [account, library, tokens, parsedTokenAmounts])

	useEffect(() => {
		if (!poolInfo.noLiquidity) {
			setTokenAmounts({ [Field.INPUT]: '', [Field.OUTPUT]: '' })
			// TODO change amount follow independentField
		}
	}, [poolInfo])

	// console.log(poolInfo);

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
		if (value === '') {
			poolInfo.noLiquidity
				? setTokenAmounts((amounts) => ({ ...amounts, [independentField]: '' }))
				: setTokenAmounts({ [Field.INPUT]: '', [Field.OUTPUT]: '' })
			return
		}

		setIndependentField(independentField)
		const remainField =
			independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
		const decimalsIndependent = tokens?.[independentField]?.decimals ?? 18
		const remainDecimals = tokens?.[remainField]?.decimals ?? 18
		let parsedAmount: Fraction | undefined
		if (poolInfo.noLiquidity) {
			setTokenAmounts((amounts) => ({ ...amounts, [independentField]: value }))
			try {
				parsedAmount = new Fraction(
					parseUnits(value, decimalsIndependent).toString()
				)
				tokens[independentField] &&
					setParsedTokenAmounts((amounts) => ({
						...amounts,
						[independentField]: new TokenAmount(
							tokens[independentField] as any,
							parsedAmount?.quotient.toString() as any
						)
					}))
			} catch (error) {
				console.error(error)
				return
			}
		} else {
			try {
				parsedAmount = new Fraction(
					parseUnits(value, decimalsIndependent).toString()
				)
			} catch (error) {
				console.error(error)
				return
			}
			if (!parsedAmount) return
			const remainParsedAmount = parsedAmount.multiply(
				poolInfo.prices[remainField]?.raw ?? '1'
			)
			setParsedTokenAmounts({
				[independentField]: new TokenAmount(
					tokens[independentField] as any,
					parsedAmount.quotient.toString()
				),
				[remainField]: new TokenAmount(
					tokens[remainField] as any,
					remainParsedAmount.quotient.toString()
				)
			} as any)
			setTokenAmounts({
				[independentField]: value,
				[remainField]: formatUnits(
					remainParsedAmount.quotient.toString(),
					remainDecimals
				)
			} as any)
		}
	}

	const isDisableBtn: boolean = useMemo(() => {
		if (
			[tokens, tokenAmounts, parsedTokenAmounts].some(
				(e) => !e[Field.INPUT] || !e[Field.OUTPUT]
			) ||
			!balances?.[0] ||
			!balances?.[1] ||
			!parsedTokenAmounts[Field.INPUT] ||
			!parsedTokenAmounts[Field.OUTPUT]
		)
			return true

		if (
			BigNumber.from(parsedTokenAmounts[Field.INPUT]?.raw.toString()).gt(
				BigNumber.from(balances[0].raw.toString())
			)
		) {
			return true
		}
		if (
			BigNumber.from(parsedTokenAmounts[Field.OUTPUT]?.raw.toString()).gt(
				BigNumber.from(balances[1].raw.toString())
			)
		) {
			return true
		}
		return false
	}, [tokens, tokenAmounts, parsedTokenAmounts])

	const isNeedApproved: boolean = useMemo(
		() => (tokensNeedApproved.length > 0 ? true : false),
		[tokensNeedApproved]
	)

	const onAddLiquidityCallback = useCallback(async () => {
		try {
			setSubmitting(true)
			await addLiquidityCallback(account, library, tokens, parsedTokenAmounts)
			setReloadPool((pre) => !pre)
			setSubmitting(false)
			setTokenAmounts({
				[Field.INPUT]: '',
				[Field.OUTPUT]: ''
			})
			alert('Add liquidity success')
		} catch (error) {
			console.error(error)
			setSubmitting(false)
		}
	}, [account, library, tokens, parsedTokenAmounts])

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
		} catch (error) {
			console.error(error)
			setSubmitting(false)
		}
	}, [account, library, tokensNeedApproved])

	const onSubmit = () => {
		if (isNeedApproved) {
			onApproveTokens()
		} else if (!isDisableBtn) {
			onAddLiquidityCallback()
		}
	}

	const buttonText = useMemo((): string => {
		if (!account) return 'Connect wallet'
		if (
			!parsedTokenAmounts[Field.INPUT] ||
			!parsedTokenAmounts[Field.OUTPUT] ||
			!balances?.[0] ||
			!balances?.[1]
		)
			return 'Add liquidity'
		if (
			BigNumber.from(parsedTokenAmounts[Field.INPUT]?.raw.toString()).gt(
				BigNumber.from(balances[0].raw.toString())
			)
		) {
			return `Insufficient ${tokens[Field.INPUT]?.symbol} balance`
		}
		if (
			BigNumber.from(parsedTokenAmounts[Field.OUTPUT]?.raw.toString()).gt(
				BigNumber.from(balances[1].raw.toString())
			)
		) {
			return `Insufficient ${tokens[Field.OUTPUT]?.symbol} balance`
		}
		if (isNeedApproved) return 'Approve tokens'
		return 'Add liquidity'
	}, [isNeedApproved, parsedTokenAmounts, balances, account])

	const getLPMinted = (): number | string | undefined => {
		try {
			if (
				!tokenAmounts[Field.INPUT] ||
				!tokenAmounts[Field.OUTPUT] ||
				!poolInfo.totalSupply ||
				!parsedTokenAmounts[Field.INPUT] ||
				!parsedTokenAmounts[Field.OUTPUT] ||
				!poolInfo?.pair?.getLiquidityMinted
			)
				return 0

			return (
				poolInfo.pair
					.getLiquidityMinted(
						poolInfo.totalSupply as TokenAmount,
						parsedTokenAmounts[Field.INPUT] as TokenAmount,
						parsedTokenAmounts[Field.OUTPUT] as TokenAmount
					)
					.toSignificant(6) ?? 0
			)
		} catch (error) {
			return 0
		}
	}

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
						value={tokenAmounts[Field.INPUT]}
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
				<AddIcon />
			</Center>

			<div>
				<HStack className="balance">
					<div>To </div>
					<div>Balance: {balances?.[1]?.toSignificant(6) ?? 0} </div>
				</HStack>
				<HStack>
					<input
						value={tokenAmounts[Field.OUTPUT]}
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

			{tokens[Field.INPUT] && tokens[Field.OUTPUT] && (
				<div>
					<SpaceBetween>
						<div>Share of Pool</div>
						<div className="value">
							{poolInfo.shareOfPool?.toSignificant(2) ?? '0'}%
						</div>
					</SpaceBetween>

					{poolInfo.totalSupply &&
						parsedTokenAmounts[Field.INPUT]?.raw.toString() !== '0' &&
						parsedTokenAmounts[Field.OUTPUT]?.raw.toString() !== '0' && (
							<SpaceBetween>
								<div>LP tokens minted</div>
								<div className="value">{getLPMinted()}</div>
							</SpaceBetween>
						)}
				</div>
			)}

			<div onClick={onSubmit} className="submit-btn">
				{buttonText}
			</div>
		</Wrapper>
	)
}

export default AddLiquidity
