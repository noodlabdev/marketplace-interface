import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DoDisturbOnRoundedIcon from '@mui/icons-material/DoDisturbOnRounded'
import { Slider, Tooltip } from '@mui/material'
import TokenIcon from 'components/TokenIcon'
import TransactionLoading from 'components/TransactionLoading'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { removeLiquidityCallback } from 'state/liquidity'
import styled from 'styled-components'

const Container = styled.div`
	padding: 16px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 10px;
	margin: 10px 0;
	&:hover {
	}
	.detail {
		padding: 4px 0;
		> div {
			margin: 4px 0;
		}
	}
	.actions {
		svg {
			cursor: pointer;
		}
	}
`

const HStack = styled.div`
	display: flex;
	align-items: center;
`

const SpaceBetween = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-weight: 600;
	.icons {
		margin-right: 8px;
		.MuiAvatar-root {
			margin-right: 8px;
		}
	}
	.MuiSvgIcon-root {
		opacity: 0.8;
		cursor: pointer;
	}
	.value {
		font-size: 16px;
	}
`
const Pool = ({ pool, setIsAdd, setReloadPool }: any) => {
	const { account, library } = useActiveWeb3React()

	const [isExpand, setIsExpand] = useState<boolean>(false)
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [removePercent, setRemovePercent] = useState<number>(0)

	const onRemoveLiquidityCallback = useCallback(() => {
		;(async () => {
			try {
				if (
					!account ||
					!library ||
					!pool.pair ||
					!pool.balanceOf ||
					removePercent === 0
				)
					return
				const removeAmount = BigNumber.from(pool.balanceOf.raw.toString())
					.mul(BigNumber.from(removePercent.toString()))
					.div(BigNumber.from('100'))
				setSubmitting(true)
				await removeLiquidityCallback(account, library, pool.pair, removeAmount)
				setReloadPool((pre: any) => !pre)
				alert('Remove success')
				setSubmitting(false)
				setRemovePercent(0)
			} catch (error) {
				setSubmitting(false)
				console.log(error)
			}
		})()
	}, [account, library, pool, removePercent])

	return (
		<Container>
			<TransactionLoading loading={submitting} />
			<SpaceBetween>
				<HStack>
					<HStack className="icons">
						<TokenIcon token={pool.pair?.token0} />
						<TokenIcon token={pool.pair?.token1} />
					</HStack>

					<HStack>
						{pool.pair?.token0.symbol} / {pool.pair?.token1.symbol}
					</HStack>
				</HStack>

				<ArrowDropDownIcon onClick={() => setIsExpand((pre) => !pre)} />
			</SpaceBetween>

			{isExpand && (
				<div className="detail">
					<SpaceBetween>
						<div>Share of pool</div>
						<div className="value">{pool.shareOfPool?.toSignificant(6)}%</div>
					</SpaceBetween>
					<SpaceBetween>
						<div>{pool.pair?.token0?.symbol}</div>
						<div className="value">
							{' '}
							{pool.shareOfPool &&
								pool.pair?.reserve0 &&
								pool.shareOfPool.multiply(pool.pair?.reserve0).toSignificant(6)}
						</div>
					</SpaceBetween>
					<SpaceBetween>
						<div>{pool.pair?.token1?.symbol}</div>
						<div className="value">
							{pool.shareOfPool &&
								pool.pair?.reserve1 &&
								pool.shareOfPool.multiply(pool.pair?.reserve1).toSignificant(6)}
						</div>
					</SpaceBetween>

					<Slider
						value={removePercent}
						onChange={(e: any) =>
							e.target?.value && setRemovePercent(e.target.value)
						}
						aria-label="Small"
						valueLabelDisplay="auto"
						color="secondary"
					/>

					<HStack className="actions">
						<Tooltip title="Add Liquidity">
							<AddCircleRoundedIcon
								sx={{ color: '#cb7fcc' }}
								fontSize="large"
								onClick={() => setIsAdd(true)}
							/>
						</Tooltip>
						<Tooltip title="Remove Liquidity">
							<DoDisturbOnRoundedIcon
								sx={{
									color: '#978e8e'
								}}
								fontSize="large"
								onClick={onRemoveLiquidityCallback}
							/>
						</Tooltip>
					</HStack>
				</div>
			)}
		</Container>
	)
}

export default Pool
