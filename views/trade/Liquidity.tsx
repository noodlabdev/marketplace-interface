import { useState } from 'react'

import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined'
import styled from 'styled-components'

import AddLiquidity from './AddLiquidity'
import Pools from './Pools'

const Wrapper = styled.div`
	border-radius: 32px;
	box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px,
		rgb(25 19 38 / 5%) 0px 1px 1px;
	color: rgb(255, 255, 255);
	overflow: hidden;
	padding: 12px;
	position: relative;
	.add-btn {
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
	.back-icon {
		margin: 0 0 0 12px;
		display: inline-block;
		svg {
			cursor: pointer;
			&:hover {
				opacity: 0.8;
			}
		}
	}
`

const Liquidity = () => {
	const [isAdd, setIsAdd] = useState(false)

	return (
		<Wrapper>
			{isAdd ? (
				<>
					<div className="back-icon" onClick={() => setIsAdd(false)}>
						<ArrowCircleLeftOutlinedIcon />
					</div>
					<AddLiquidity />
				</>
			) : (
				<>
					<div onClick={() => setIsAdd(true)} className="add-btn">
						Add Liquidity
					</div>
					<Pools setIsAdd={setIsAdd} />
				</>
			)}
		</Wrapper>
	)
}

export default Liquidity
