import React from 'react'

import { Container } from '@mui/material'
import Title from 'components/Title'
import styled from 'styled-components'

const Wrapper = styled(Container)`
	padding: 80px 0;
	color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	.chart {
		display: flex;
		justify-content: center;
		padding-right: 20px;
		img {
			width: 100%;
			max-width: 100%;
			padding: 12px;
			transform: translateX(-4%);
		}
	}
`

function Tokenomics() {
	return (
		<Wrapper id="tokenomics" className="row mx-0 py-3">
			<Title>Tokenomic</Title>
			<div className="chart">
				<img src="/images/tokenomic.png" alt="tokenomic" />
			</div>
		</Wrapper>
	)
}

export default Tokenomics
