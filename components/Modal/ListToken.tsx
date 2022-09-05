import React, { useCallback, useEffect, useState } from 'react'

import { CircularProgress, Modal } from '@mui/material'
import { Token } from '@uniswap/sdk'
import TokenIcon from 'components/TokenIcon'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import useListTokens from 'hooks/useListTokens'
import { getToken } from 'state/erc20'
import styled from 'styled-components'
import { isAddress } from 'utils'

const ModalCustom = styled(Modal)`
	background-color: rgba(255, 255, 255, 0.8);
	padding: 12px;
`

export const Wrapper = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	min-width: 400px;
	max-width: 100%;
	padding: 20px;
	background: rgb(25, 16, 52);
	box-shadow: rgb(14 14 44 / 10%) 0px 20px 36px -8px,
		rgb(0 0 0 / 5%) 0px 1px 1px;
	border-radius: 15px;
	color: #ffffff;
	outline: none;
	h3 {
		font-size: 20px;
	}
	input {
		width: 100%;
		background-color: rgba(255, 255, 255, 0.2);
		padding: 10px 12px;
		border-radius: 15px;
		border: none;
		outline: none;
		color: #fff;
		margin: 12px 0;
	}
`

const TokenItem = styled.div`
	display: flex;
	align-items: center;
	padding: 8px 0;
	border-radius: 15px;
	div {
		margin-left: 12px;
	}
	:hover {
		background: rgba(255, 255, 255, 0.2);
		cursor: pointer;
	}
`

interface ListTokenProps {
	open: boolean
	handleClose: () => void
	callback: (token: Token) => void
}

const ListToken = ({ open, handleClose, callback }: ListTokenProps) => {
	const listTokens = useListTokens()
	const { library } = useActiveWeb3React()

	const [searchToken, setSearchToken] = useState<string>('')
	const [tokens, setTokens] = useState<Token[]>([])
	const [loading, setLoading] = useState(false)

	const handleSearchToken = useCallback(async (): Promise<Token[]> => {
		if (!searchToken || !isAddress(searchToken)) return listTokens
		const existsTokens = listTokens.filter(
			(t) => t.address.toLowerCase() === searchToken.toLowerCase()
		)
		if (existsTokens.length) return existsTokens
		const _t = await getToken(searchToken, library)
		if (_t instanceof Token) return [_t]
		return []
	}, [listTokens, searchToken, library])

	const getTokens = async () => {
		try {
			setLoading(true)
			const _tokens = await handleSearchToken()
			setTokens(_tokens)
			setLoading(false)
		} catch (error) {
			setLoading(false)
			console.error(error)
		}
	}

	useEffect(() => {
		getTokens()
	}, [handleSearchToken])

	return (
		<ModalCustom
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Wrapper>
				<h3>Select a token</h3>
				<input
					placeholder="enter token address"
					onChange={(e) => setSearchToken(e.target.value)}
				/>

				{loading ? (
					<div>
						<CircularProgress />
					</div>
				) : (
					tokens.map((token, idx) => (
						<TokenItem
							key={idx}
							onClick={() => {
								setSearchToken('')
								callback(token)
								handleClose()
							}}>
							<TokenIcon token={token} />
							<div>{token.symbol}</div>
						</TokenItem>
					))
				)}
			</Wrapper>
		</ModalCustom>
	)
}

export default ListToken
