import Image from 'next/image'

import { CountryItemProps } from '.'
import {
	CountryItemContainer,
	CountryName,
	FlagContainer
} from './CountryCard.styled'

function CountryCard({ srcFlag, countryName }: CountryItemProps) {
	return (
		<CountryItemContainer>
			<FlagContainer>
				<Image
					priority
					src={srcFlag}
					alt="Logo"
					layout="fill"
					objectPosition="left center"
				/>
			</FlagContainer>
			<CountryName>{countryName}</CountryName>
		</CountryItemContainer>
	)
}

export default CountryCard
