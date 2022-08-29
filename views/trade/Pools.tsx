// import HelpIcon from '@mui/icons-material/Help'
// import { IconButton, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'

import { CircularProgress } from '@mui/material'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { PoolState, getOwnerLiquidityPools } from 'state/liquidity'
import styled from 'styled-components'

import Pool from './Pool'

const Center = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const Main = styled.div`
	padding: 12px 0;
`

const NoConnectOrNoPool = styled.div`
	background: #ffffff;
	border-radius: 15px;
	color: rgb(189, 194, 196);
	padding: 40px;
	text-align: center;
	font-size: 16px;
`

const PoolFooter = styled.div`
	display: flex;
	.import {
		cursor: pointer;
		margin-left: 6px;
		color: rgb(100, 44, 220);
	}
`

const Pools = ({ setIsAdd }: any) => {
	const { account, library } = useActiveWeb3React()

	const [loading, setLoading] = useState<boolean>(true)
	const [reloadPool, setReloadPool] = useState<boolean>(false)
	const [ownerPools, setOwnerPools] = useState<PoolState[]>([])

	useEffect(() => {
		let isMounted = true
		getOwnerLiquidityPools(library, account)
			.then((res) => {
				isMounted && setOwnerPools(res as any)
				setLoading(false)
			})
			.catch((error) => {
				setLoading(false)
				console.error(error)
			})
		return () => {
			isMounted = false
		}
	}, [account, library, reloadPool])

	return (
		<div>
			<div>Your Liquidity</div>
			<Main>
				{!account ? (
					<NoConnectOrNoPool>
						Connect to a wallet to view your liquidity.
					</NoConnectOrNoPool>
				) : loading ? (
					<Center>
						<CircularProgress />
					</Center>
				) : !ownerPools.length ? (
					<NoConnectOrNoPool>No pools</NoConnectOrNoPool>
				) : (
					<div>
						{ownerPools.map((pool, idx) => (
							<Pool
								key={idx}
								pool={pool}
								setIsAdd={setIsAdd}
								setReloadPool={setReloadPool}
							/>
						))}
					</div>
				)}
			</Main>
			<PoolFooter>
				<div>Don't see a pool you joined? </div>
				<div className="import" onClick={() => setIsAdd(true)}>
					Import it.
				</div>
			</PoolFooter>
		</div>
	)
}

export default Pools
