import { useCallback, useEffect, useState } from 'react'

import { Token } from '@uniswap/sdk'
import { getToken } from 'state/erc20'

import { useActiveWeb3React } from './useActiveWeb3React'

const useToken = (address: string) => {
	const { library } = useActiveWeb3React()

	const [token, setToken] = useState<Token | undefined>()

	const _getToken = useCallback(async () => {
		try {
			if (address) {
				const token = await getToken(address, library)
				setToken(token)
			}
			setToken(undefined)
		} catch (error) {
			console.log(error)
		}
	}, [address, library])

	useEffect(() => {
		_getToken()
	}, [_getToken])

	return token
}

export default useToken
