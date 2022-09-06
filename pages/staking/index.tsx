import { useCallback, useEffect, useState } from 'react'

import Image from 'next/image'

import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import CalculateIcon from '@mui/icons-material/Calculate'
import ShareIcon from '@mui/icons-material/Share'
import { Modal } from '@mui/material'
import { Container } from '@mui/system'
import TransactionLoading from 'components/TransactionLoading'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import styled from 'styled-components'
import {
	claimStake,
	getStakeInfo,
	stake,
	withdrawStake
} from 'utils/callContract'

const Wrapper = styled(Container)`
	padding: 48px 0;
	color: #fff;
	display: flex;
	justify-content: center;

	.title {
		font-weight: 600;
		font-size: 24px;
	}
	.sub-title {
		font-weight: 600;
	}
	button {
		color: #fff;
		margin: 12px 0;
		background: linear-gradient(310deg, #cb7fcc 25%, #fc52ff 100%);
		padding: 12px;
		cursor: pointer;
		border-radius: 15px;
		text-align: center;
		border: none;
		font-weight: 600;
		&:hover {
			opacity: 0.8;
		}
	}
	.enable {
		width: 100%;
	}
`

const Stack = styled.div`
	width: 480px;
	padding: 12px 28px;
	background: rgb(25, 16, 52);
	border-radius: 32px;
	box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px,
		rgb(25 19 38 / 5%) 0px 1px 1px;
	color: rgb(255, 255, 255);
`

const VStack = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	> div {
		margin: 4px 0;
	}
`

const Flex = styled.div`
	display: flex;
	align-items: center;
	> div {
		margin: 0 4px;
	}
	&.detail {
		justify-content: flex-end;
		cursor: pointer;
	}
	&.info {
		justify-content: flex-end;
		a {
			color: #ffffff;
			text-decoration: none;
			margin-right: 6px;
		}
		div {
			cursor: pointer;
		}
	}
`

const Center = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	button {
		margin: 0 8px;
		min-width: 100px;
		color: #fff;
		background: linear-gradient(310deg, #cb7fcc 25%, #fc52ff 100%);
		padding: 12px;
		cursor: pointer;
		border-radius: 15px;
		text-align: center;
		border: none;
		font-weight: 600;
		&:hover {
			opacity: 0.8;
		}
	}
`

const HStack = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	> input {
		flex: 1;
	}
`

const ModalCustom = styled(Modal)`
	background-color: rgba(255, 255, 255, 0.8);
	padding: 12px;
`

export const ModalWrapper = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	min-width: 400px;
	max-width: 100%;
	padding: 20px;
	background: rgb(25, 16, 52);
	box-shadow: rgb(14 14 44 / 10%) 0px 20px 36px -8px,
		rgb(0 0 0 / 5%) 0px 1px 1px;
	border-radius: 15px;
	color: #ffffff;
	outline: none;
	h3 {
		font-size: 20px;
	}
	input {
		width: 100%;
		background-color: rgba(255, 255, 255, 0.2);
		padding: 10px 12px;
		border-radius: 15px;
		border: none;
		outline: none;
		color: #fff;
		margin: 12px 0;
	}
`

const Staking = () => {
	const { account, library } = useActiveWeb3React()

	const [isExpand, setIsExpand] = useState<boolean>(false)
	const [open, setOpen] = useState(false)
	const [stakeAmount, setStakeAmount] = useState<string>('')
	const [refresh, setRefresh] = useState(false)
	const [stakeInfo, setStakeInfo] = useState<any>({
		apr: undefined,
		balanceOf: undefined,
		pendingReward: undefined,
		totalSupply: undefined
	})
	const [submitting, setSubmitting] = useState(false)

	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	const handleGetStakeInfo = useCallback(async () => {
		if (!account || !library) return
		const stakeInfo = await getStakeInfo(library, account)
		console.log(stakeInfo)
		setStakeInfo(stakeInfo)
	}, [account, library, refresh])

	useEffect(() => {
		handleGetStakeInfo()
	}, [handleGetStakeInfo])

	const handleStake = async () => {
		if (!account || !library) return alert('Connect wallet before do that')
		if (!stakeAmount || isNaN(+stakeAmount) || !+stakeAmount)
			return alert('Invalid stake amount')

		try {
			setSubmitting(true)
			await stake(library, account, stakeAmount)
			setRefresh((pre) => !pre)
			alert('Stake success')
			handleClose()
			setSubmitting(false)
		} catch (error: any) {
			setSubmitting(false)
			console.log(error)
			alert(error.message)
		}
	}

	const handleHarvest = async () => {
		if (!account || !library) return alert('Connect wallet before do that')
		try {
			setSubmitting(true)
			await claimStake(library, account)
			setRefresh((pre) => !pre)
			alert('Harvest success')
			setSubmitting(false)
		} catch (error: any) {
			setSubmitting(false)
			console.log(error)
			alert(error.message)
		}
	}

	const handleWithdraw = async () => {
		if (!account || !library) return alert('Connect wallet before do that')
		if (!stakeAmount || isNaN(+stakeAmount) || !+stakeAmount)
			return alert('Invalid stake amount')

		try {
			setSubmitting(true)
			await withdrawStake(library, account, stakeAmount)
			setRefresh((pre) => !pre)
			alert('Withdraw success')
			handleClose()
			setSubmitting(false)
		} catch (error: any) {
			setSubmitting(false)
			console.log(error)
			alert(error.message)
		}
	}

	return (
		<Wrapper>
			<TransactionLoading loading={submitting} />
			<ModalCustom
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<ModalWrapper>
					<h3>ENABLE</h3>
					<hr />
					<VStack>
						<HStack>
							<div>STAKED</div>
							<div>
								{formatEther(stakeInfo.balanceOf?.toString() ?? '0')} PIP
							</div>
						</HStack>
						<VStack>
							<div>Enter amount:</div>
							<input
								type={'number'}
								value={stakeAmount}
								onChange={(e) => setStakeAmount(e.target.value)}
							/>
						</VStack>
						<Center>
							<button onClick={handleStake}>Stake</button>
							<button onClick={handleWithdraw}>Withdraw</button>
						</Center>
					</VStack>
				</ModalWrapper>
			</ModalCustom>

			<Stack className="content">
				<HStack>
					<div>
						<div className="title">Stake PIP</div>
						<div>Stake, Earn </div>
					</div>
					<div>
						<Image height={80} width={80} src="/logo.png" alt="logo" />
					</div>
				</HStack>
				<VStack>
					<HStack>
						<div className="sub-title">APR:</div>
						<Flex>
							<div>{(stakeInfo.apr * 100) / 1e5}%</div>
							<CalculateIcon />
						</Flex>
					</HStack>
					<HStack>
						<div>
							<div className="sub-title">BNB EARNED:</div>
							<div>
								{formatEther(stakeInfo.pendingReward?.toString() ?? '0')}
							</div>
						</div>
						<button
							className={
								stakeInfo.pendingReward?.gt(BigNumber.from('0'))
									? 'btn-harvest-allow'
									: 'btn-harvest'
							}
							onClick={handleHarvest}>
							HARVEST
						</button>
					</HStack>
					<div>
						<div className="sub-title">Stake now</div>
						<button className="enable" onClick={handleOpen}>
							ENABLE
						</button>
					</div>
				</VStack>
				<VStack>
					<Flex className="detail">
						{isExpand ? (
							<Flex onClick={() => setIsExpand(false)}>
								<div>Hide</div>
								<ArrowDropUpIcon />
							</Flex>
						) : (
							<Flex onClick={() => setIsExpand(true)}>
								<div>Details</div>
								<ArrowDropDownIcon />
							</Flex>
						)}
					</Flex>
					{isExpand && (
						<VStack>
							<HStack>
								<div className="sub-title">APR:</div>
								<Flex>
									<div>{(stakeInfo.apr * 100) / 1e5}%</div>
									<CalculateIcon />
								</Flex>
							</HStack>
							<HStack className="info">
								<div className="sub-title">Total staked:</div>
								<div>
									{formatEther(stakeInfo.balanceOf?.toString() ?? '0')} PIP
								</div>
							</HStack>

							<Flex className="info">
								<a href="/">See Token Info</a>
								<ShareIcon />
							</Flex>
							<Flex className="info">
								<a href="/">View project</a>
								<ShareIcon />
							</Flex>

							<Flex className="info">
								<a href="/">View contract</a>
								<ShareIcon />
							</Flex>
							<Flex className="info">
								<div>Add to metamask</div>
								<ShareIcon />
							</Flex>
						</VStack>
					)}
				</VStack>
			</Stack>
		</Wrapper>
	)
}

export async function getStaticProps() {
	return {
		props: {
			title: 'FIG STAKING',
			description: 'This is a description for PIG STAKING page'
		}
	}
}

export default Staking
