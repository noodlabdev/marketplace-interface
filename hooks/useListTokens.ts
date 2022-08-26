import { useMemo } from 'react'

import { getListTokens } from 'utils/networks'

const useListTokens = () => {
	return useMemo(() => getListTokens(), [])
}

export default useListTokens
