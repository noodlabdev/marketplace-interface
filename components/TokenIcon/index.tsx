import { useEffect, useState } from 'react'

import { Avatar } from '@mui/material'
import { Token } from '@uniswap/sdk'
import { TOKEN_ICON_LIST } from 'constants/trade'

const fallbackImage = '/tokens/anonymous-token.svg'

const TokenIcon = ({ token }: { token: Token | undefined }) => {
	const [url, setUrl] = useState<string | undefined>('')

	useEffect(() => {
		setUrl(token?.address ? TOKEN_ICON_LIST[token.address] : undefined)
	}, [token])

	const errorHandler = () => {
		setUrl(fallbackImage)
	}

	return (
		<Avatar
			sx={{ width: 32, height: 32 }}
			src={url}
			imgProps={{
				onError: errorHandler
			}}>
			?
		</Avatar>
	)
}

export default TokenIcon
