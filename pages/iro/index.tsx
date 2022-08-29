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

const IRO = () => {
	return (
		<Wrapper>
			<Container>
				<Title>Coming soon</Title>
			</Container>
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
