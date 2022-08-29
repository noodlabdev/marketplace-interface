import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { Container } from '@mui/system'
import { Title } from 'components'
import styled from 'styled-components'

const Wrapper = styled.div`
	padding: 48px 0;
	color: #fff;
	text-align: center;
	.content {
		display: flex;
		justify-content: center;
	}
	button {
		color: #fff;
		min-width: 120px;
		margin: 12px 0;
		background: linear-gradient(310deg, #cb7fcc 25%, #fc52ff 100%);
		padding: 12px;
		cursor: pointer;
		border-radius: 15px;
		text-align: center;
		border: none;
		&:hover {
			opacity: 0.8;
		}
	}
`

const DAO = () => {
	return (
		<Wrapper>
			<Container>
				<Title>Vote</Title>
				<div>PigPink token will be listed on DEX</div>

				<div className="content">
					<div>
						<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							defaultValue="gate"
							name="radio-buttons-group">
							<FormControlLabel
								value="gate"
								control={<Radio color="secondary" />}
								label="1. Gate.io"
							/>
							<FormControlLabel
								value="mexc"
								control={<Radio color="secondary" />}
								label="2. MEXC"
							/>
							<FormControlLabel
								value="houibi"
								control={<Radio color="secondary" />}
								label="3. HOUIBI"
							/>
						</RadioGroup>
					</div>
				</div>

				<button>VOTE</button>
			</Container>
		</Wrapper>
	)
}

export async function getStaticProps() {
	return {
		props: {
			title: 'FIG DAO',
			description: 'This is a description for PIG DAO page'
		}
	}
}

export default DAO
