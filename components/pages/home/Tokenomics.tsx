import React from 'react'
import { Doughnut } from 'react-chartjs-2'

import { Container } from '@mui/material'
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js'
import Title from 'components/Title'
import styled from 'styled-components'

const Wrapper = styled(Container)`
	padding: 80px 0;
	color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	h1 {
		margin-bottom: 60px;
	}
	.chart {
		padding-right: 20px;
		canvas {
			width: 640px;
			max-width: 100%;
		}
	}
	.detail {
		flex: 1;
		.MuiLinearProgress-root {
			width: 100%;
		}
		.label {
			display: block;
			white-space: nowrap;
		}
	}
`

Chart.register(ArcElement, Tooltip, Legend)

function Tokenomics() {
	const dat = {
		labels: ['Presale', 'Liquidity', 'Stacking', 'Team', 'Pig DAO', 'Burn'],
		datasets: [
			{
				label: 'Tokenomics',
				data: [30, 16, 3, 1, 1, 49],
				backgroundColor: [
					'rgb(255, 99, 132)',
					'#9fe080',
					'#e226ac',
					'rgb(255, 205, 86)',
					'rgb(54, 162, 235)',
					'#fe6922'
				],
				hoverOffset: 4,
				spacing: 1,
				borderRadius: 12
			}
		]
	}

	return (
		<Wrapper id="tokenomics" className="row mx-0 py-3">
			<Title>Tokenomic</Title>
			<div className="chart">
				<Doughnut data={dat} />
			</div>
		</Wrapper>
	)
}

export default Tokenomics
