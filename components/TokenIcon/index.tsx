import { useEffect, useState } from 'react'

import { Avatar } from '@mui/material'
import { Token } from '@uniswap/sdk'

const fallbackImage = '/tokens/anonymous-token.svg'

const TokenIcon = ({ token }: { token: Token | undefined }) => {
	const [url, setUrl] = useState<string | undefined>('')

	useEffect(() => {
		setUrl(token?.address)
	}, [token])

	const errorHandler = () => {
		setUrl(fallbackImage)
	}

	return (
		<Avatar
			sx={{ width: 32, height: 32 }}
			src={`/tokens/${url}.svg`}
			imgProps={{
				onError: errorHandler
			}}>
			?
		</Avatar>
	)
}

export default TokenIcon
