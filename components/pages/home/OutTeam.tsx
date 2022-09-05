import { Container, Grid } from '@mui/material'
import { MemberCard } from 'components/Card/MemberCard'
import Title from 'components/Title'
import styled from 'styled-components'
import { Section } from 'styles'

const Wrapper = styled(Container)`
	h1 {
		margin-bottom: 24px;
		text-align: center;
	}
	.MuiGrid-root.MuiGrid-container {
		grid-auto-rows: 1fr;
		place-items: normal;
	}
`

const data = [
	{
		name: 'Michael Fillin (CEO)',
		avatarSrc: '/images/members/member-1.jpeg',
		role: [
			'Leader team Piggy (2022)',
			'Co-founder Moonlap capital',
			'IT manager for Lloyds Bank (Headquarters)',
			'Programmer at canon digital',
			'Bachelor of Informatics University of Bath'
		]
	},
	{
		name: 'Lyng Tan (CMO)',
		avatarSrc: '/images/members/member-2.jpeg',
		role: [
			'CMO of PiggyPink project (2022)',
			'CMO of  The Leakteam call',
			'Digital Marketing manager Varporl Brand',
			'Bachelor of Informatics University of Bath'
		]
	},
	{
		name: 'Wong Liu (Blockchain dev)',
		avatarSrc: '/images/members/member-3.jpeg',
		role: [
			'5 years blockchain experience',
			'Number of participating projects: 12',
			'Current job: Full time crypto'
		]
	},
	{
		name: 'Aarush (Blockchain dev)',
		avatarSrc: '/images/members/member-4.jpeg',
		role: [
			'In charge of blockchain and security of the project. The creator of the idea IRO',
			'Live in London',
			'4 years blockchain experience',
			'Number of participating projects: 9',
			'Current job: Full time crypto'
		]
	},
	{
		name: 'Miley Agatha (In charge of the economy)',
		avatarSrc: '/images/members/member-5.jpeg',
		role: [
			'Manager Economy Piggypink Finance',
			'Finance Manager at GBank Capital',
			'Economist London Stock Exchange',
			'Bachelor of Economics of University of Warwick'
		]
	},
	{
		name: 'Peter Holk (Designer)',
		avatarSrc: '/images/members/member-6.jpeg',
		role: [
			"Nothing much, he's an artist, all Piggypink finance's images are drawn by him"
		]
	}
]

const OurTeam = () => {
	return (
		<Section>
			<Wrapper>
				<Title>Our Team</Title>
				<Grid container spacing={{ xs: 2, md: 3 }} gridAutoRows="1fr">
					{data.map((item, index) => (
						<Grid key={index} item xs={6} md={4}>
							<MemberCard member={item} />
						</Grid>
					))}
				</Grid>
			</Wrapper>
		</Section>
	)
}

export default OurTeam
