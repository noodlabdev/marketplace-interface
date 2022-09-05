import LinearProgress, {
	linearProgressClasses
} from '@mui/material/LinearProgress'
import { Container } from '@mui/system'
import styled from 'styled-components'

const BorderLinearProgress = styled(LinearProgress)(() => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: 'rgba(255, 255, 255, 0.2)'
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: '#cb7fcc'
	}
}))

const Wrapper = styled(Container)`
	padding: 48px 0;
	color: #fff;
	display: flex;
	justify-content: center;

	.title {
		font-weight: 600;
	}
	button {
		color: #fff;
		width: 100%;
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

const Stack = styled.div`
	width: 640px;
	padding: 12px;
	background: rgb(25, 16, 52);
	border-radius: 32px;
	box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px,
		rgb(25 19 38 / 5%) 0px 1px 1px;
	color: rgb(255, 255, 255);
	display: flex;
	max-width: 100%;
	> div {
		flex: 1;
		text-align: left;
		padding: 12px 24px 12px 12px;
	}
	@media screen and (max-width: 992px) {
		flex-direction: column;
		margin: 12px;
	}
`

const VStack = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	> div {
		margin: 8px 0;
	}
	input {
		flex: 1;
		margin: 8px 12px 0 0;
		background-color: rgba(255, 255, 255, 0.2);
		padding: 10px 12px;
		border-radius: 15px;
		border: none;
		outline: none;
		color: #fff;
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

const IRO = () => {
	return (
		<Wrapper>
			{/* <Title>Coming soon</Title>
			 */}
			<Stack className="content">
				<VStack>
					<div className="title">IRO TIMELINE</div>
					<HStack>
						<div className="title">WHITELIST</div>
						<div className="title">PUBLIC</div>
					</HStack>
					<div>
						<div>Buy</div>
						<HStack>
							<input />
							<div>BNB</div>
						</HStack>
						<button>APPROVE</button>
					</div>
				</VStack>
				<VStack>
					<div className="title">IRO INFO</div>
					<HStack>
						<div className="title">Total Raise</div>
						<div>500 BNB</div>
					</HStack>
					<HStack>
						<div className="title">Ref $PIP</div>
						<div>150 $PIP</div>
					</HStack>
					<button>CLAIM</button>
					<div>
						<div className="title">Total Progress</div>
						<BorderLinearProgress variant="determinate" value={60} />
						<HStack>
							<div>Start time:</div>
							<div>2:00 PM 2022-09-09</div>
						</HStack>
						<HStack>
							<div>End time:</div>
							<div>2:30 PM 2022-09-09</div>
						</HStack>
					</div>
				</VStack>
			</Stack>
		</Wrapper>
	)
}

export async function getStaticProps() {
	return {
		props: {
			title: 'FIG IRO',
			description: 'This is a description for PIG IRO page'
		}
	}
}

export default IRO
