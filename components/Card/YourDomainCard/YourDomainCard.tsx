import { useState } from 'react'

import Image from 'next/image'

import TransactionLoading from 'components/TransactionLoading'
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { createAuction, createFixedPrice } from 'utils/callContract'

import { YourNFTCardProps } from '.'
import { DomainCardButton } from '../DomainCard/DomainCard.styled'
import {
	// ButtonSetting,
	OnSaleWrap,
	YourDomainCardName,
	YourDomainCardWrap
} from './YourDomainCard.styled'

function YourDomainCard({ nft, _refetch }: YourNFTCardProps) {
	const { account, library } = useActiveWeb3React()

	const [submitting, setSubmitting] = useState<boolean>(false)

	// // fixed price
	// const [open, setOpen] = useState<boolean>(false)
	// const [price, setPrice] = useState<string>('')
	// // auction
	// const [openAuction, setOpenAuction] = useState<boolean>(false)
	// const [startPrice, setStartPrice] = useState<string>('')
	// const [minBidIncrement, setMinBidIncrement] = useState<string>('')
	// const [duration, setDuration] = useState<string>('')

	// const handleChange = (_: SyntheticEvent<Element, Event>, value: DOMAIN) => {
	// 	setTab(value)
	// }

	// // handle auction modal
	// const handleOpen = () => setOpen(true)
	// const handleClose = () => setOpen(false)

	// // handle auction modal
	// const handleOpenAuction = () => setOpenAuction(true)
	// const handleCloseAuction = () => setOpenAuction(false)

	const handleCreateFixedPrice = async () => {
		if (!account || !library) return alert('connect wallet before')
		const price = prompt('Enter your price')
		if (!price) return

		try {
			setSubmitting(true)
			await createFixedPrice(library, account, nft.id, price)
			_refetch && _refetch()
			alert('Create fixed price success')
			setSubmitting(false)
		} catch (error: any) {
			error.reason && alert(error.reason)
			setSubmitting(false)
		}
	}

	const handleCreateAuction = async () => {
		if (!account || !library) return alert('connect wallet before')
		const startPrice = prompt('Enter start price of auction (BNB)')
		if (!startPrice) return
		const duration = prompt('Enter duration of auction (days)')
		if (!duration) return
		const minBidIncrement = prompt('Enter min bid  increment of auction (BNB)')
		if (!minBidIncrement) return

		try {
			setSubmitting(true)
			await createAuction(
				library,
				account,
				nft.id,
				startPrice,
				minBidIncrement,
				duration
			)
			_refetch && _refetch()
			alert('create auction success')
			setSubmitting(false)
		} catch (error: any) {
			error.reason && alert(error.reason)
			setSubmitting(false)
		}
	}

	return (
		<>
			{/* <Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<div>
					<input
						placeholder="price"
						type="number"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
					<button onClick={handleCreateFixedPrice}>create fixed price</button>
				</div>
			</Modal>
			<Modal
				open={openAuction}
				onClose={handleCloseAuction}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<div>
					<input
						placeholder="start price"
						value={startPrice}
						onChange={(e) => setStartPrice(e.target.value)}
					/>
					<input
						placeholder="min bid increment"
						value={minBidIncrement}
						onChange={(e) => setMinBidIncrement(e.target.value)}
					/>
					<input
						placeholder="duration (days)"
						value={duration}
						onChange={(e) => setDuration(e.target.value)}
					/>
					<button onClick={handleCreateAuction}>create auction</button>
				</div>
			</Modal> */}
			<TransactionLoading loading={submitting} />
			<YourDomainCardWrap>
				<div className="yd-card-left">
					<Image src={nft.nftURI} alt="nft" height={400} width={400} />
					<YourDomainCardName>ID: {nft.id}</YourDomainCardName>
					<OnSaleWrap>
						<DomainCardButton
							variant="contained"
							onClick={handleCreateFixedPrice}
							children={'Sell'} // eslint-disable-line react/no-children-prop
						/>
						<DomainCardButton
							variant="contained"
							onClick={handleCreateAuction}
							children={'Auction'} // eslint-disable-line react/no-children-prop
						/>
					</OnSaleWrap>
				</div>
			</YourDomainCardWrap>
		</>
	)
}

export default YourDomainCard
