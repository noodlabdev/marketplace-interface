import { gql } from '@apollo/client'

export const GET_NFT_ON_SALE = gql`
	query GetNFTOnSale {
		auctions(where: { closed: false }) {
			id
			nft {
				id
				nftURI
				sale
				ownerSale
			}
			start
			end
			hightestBid
			highestBidder
		}
		fixedPrices(
			where: {
				highestBidder: "0x0000000000000000000000000000000000000000"
				closed: false
			}
		) {
			id
			nft {
				id
				nftURI
				sale
				ownerSale
			}
			start
			hightestBid
			highestBidder
		}
	}
`

export const GET_YOUR_NFT = gql`
	query GetYourNFT($account: String!) {
		nfts(where: { owner: $account }) {
			id
			nftURI
			owner
			ownerSale
			sale
		}
	}
`

export const GET_YOUR_NFT_ON_SALE = gql`
	query GetYourNFTOnSale($account: String!) {
		nfts(where: { ownerSale: $account }) {
			id
			nftURI
			owner
			ownerSale
			sale
		}
	}
`

export const GET_AUCTIONS_BIDED = gql`
	query GetAuctionBided($account: String!) {
		userBids(where: { user: $account, claimed: false }) {
			id
			user
			auction {
				id
				nft {
					id
					nftURI
				}
			}
			claimed
		}
	}
`

// $orderBy: String!
// $orderDir: String!
// $timestamp: String!

const ServiceGraph = {
	GET_NFT_ON_SALE,
	GET_YOUR_NFT_ON_SALE
}

export default ServiceGraph
