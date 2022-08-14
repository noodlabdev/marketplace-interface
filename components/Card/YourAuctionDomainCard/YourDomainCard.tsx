import { useState } from 'react'

import Image from 'next/image'

import TransactionLoading from 'components/TransactionLoading'
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { claim } from 'utils/callContract'

import { YourNFTCardProps } from '.'
import { DomainCardButton } from '../DomainCard/DomainCard.styled'
import {
	// ButtonSetting,
	OnSaleWrap,
	YourDomainCardName,
	YourDomainCardWrap
} from './YourDomainCard.styled'

function YourDomainCard({ auction, nft, _refetch }: YourNFTCardProps) {
	const { account, library } = useActiveWeb3React()

	const [submitting, setSubmitting] = useState<boolean>(false)

	const handleClaim = async () => {
		if (!account || !library) return alert('connect wallet before')

		try {
			setSubmitting(true)
			await claim(library, account, auction.id)
			_refetch && _refetch()
			alert('Claim success')
			setSubmitting(false)
		} catch (error: any) {
			error.reason && alert(error.reason)
			setSubmitting(false)
		}
	}

	return (
		<>
			<TransactionLoading loading={submitting} />

			<YourDomainCardWrap>
				<div className="yd-card-left">
					<Image src={nft.nftURI} alt="nft" height={400} width={400} />
					<YourDomainCardName>ID: {nft.id}</YourDomainCardName>
					<OnSaleWrap>
						<DomainCardButton
							variant="contained"
							onClick={handleClaim}
							children={'Claim'} // eslint-disable-line react/no-children-prop
						/>
					</OnSaleWrap>
				</div>
			</YourDomainCardWrap>
		</>
	)
}

export default YourDomainCard
