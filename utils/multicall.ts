import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { getMulticallContract } from 'hooks/useContract'

export interface Call {
	address: string
	callData: string
}
export interface ListenerOptions {
	// how often this data should be fetched, by default 1
	readonly blocksPerFetch?: number
}
export interface Result extends ReadonlyArray<any> {
	readonly [key: string]: any
}

type MethodArg = string | number | BigNumber

type OptionalMethodInputs =
	| Array<MethodArg | MethodArg[] | undefined>
	| undefined

export function parseCallKey(callKey: string): Call {
	const pcs = callKey.split('-')
	if (pcs.length !== 2) {
		throw new Error(`Invalid call key: ${callKey}`)
	}
	return {
		address: pcs[0],
		callData: pcs[1]
	}
}

export const getSingleContractMultipleData = async (
	library: Web3Provider,
	contract: Contract | null | undefined,
	methodName: string,
	callInputs: OptionalMethodInputs[]
): Promise<Result | undefined> => {
	if (!contract?.interface) return undefined
	const fragment = contract.interface?.getFunction(methodName)
	const calls =
		contract && fragment && callInputs && callInputs.length > 0
			? callInputs.map<Call>((inputs) => {
					return {
						address: contract.address,
						callData: contract.interface.encodeFunctionData(fragment, inputs)
					}
			  }) // eslint-disable-line no-mixed-spaces-and-tabs
			: []
	const multicallContract = await getMulticallContract(library)
	const chunks = await fetchChunk(multicallContract, calls)
	const { results } = chunks
	return results.map((result) =>
		contract.interface?.decodeFunctionResult(methodName, result)
	)
}

export const getMultipleContractMultipleData = async (
	library: Web3Provider,
	contracts: (Contract | undefined)[],
	methodName: string,
	callInputs: OptionalMethodInputs[]
): Promise<Result | undefined> => {
	if (contracts.length != callInputs.length) return
	const calls: any = contracts.map((contract, i) => {
		if (!contract?.interface) return undefined
		const fragment = contract.interface.getFunction(methodName)
		return {
			address: contract.address,
			callData: contract.interface.encodeFunctionData(fragment, callInputs[i])
		}
	})
	const multicallContract = await getMulticallContract(library)
	const chunks = await fetchChunk(multicallContract, calls)
	const { results } = chunks
	return results.map((result, i) => {
		try {
			return contracts[i]?.interface?.decodeFunctionResult(methodName, result)
		} catch (error) {
			return undefined
		}
	})
}

export const getSingleContractMultipleDataMultipleMethods = async (
	library: Web3Provider,
	contract: Contract,
	methodNames: string[],
	callInputs: OptionalMethodInputs[]
): Promise<Result | undefined> => {
	if (methodNames.length != callInputs.length) return
	const calls: any = methodNames.map((methodName, i) => {
		if (!contract?.interface) return undefined
		const fragment = contract.interface.getFunction(methodName)
		return {
			address: contract.address,
			callData: contract.interface.encodeFunctionData(fragment, callInputs[i])
		}
	})
	const multicallContract = await getMulticallContract(library)
	const chunks = await fetchChunk(multicallContract, calls)
	const { results } = chunks
	return results.map((result, i) =>
		contract.interface?.decodeFunctionResult(methodNames[i], result)
	)
}

export const getMultipleContractMultipleDataMultipleMethods = async (
	library: Web3Provider,
	contracts: (Contract | undefined)[],
	methodNames: string[],
	callInputs: OptionalMethodInputs[]
): Promise<Result> => {
	return Promise.all(
		contracts.map(async (contract, i) => {
			if (!contract?.interface) return undefined
			const fragment = contract.interface.getFunction(methodNames[i])
			const calls: any =
				contract && fragment && callInputs && callInputs.length > 0
					? callInputs.map<Call>((inputs) => {
							return {
								address: contract.address,
								callData: contract.interface.encodeFunctionData(
									fragment,
									inputs
								)
							}
					  }) // eslint-disable-line no-mixed-spaces-and-tabs
					: [] // eslint-disable-line prettier/prettier
			const multicallContract = await getMulticallContract(library)
			const chunks = await fetchChunk(multicallContract, calls)
			const { results } = chunks
			return results.map((result) =>
				contract.interface?.decodeFunctionResult(methodNames[i], result)
			)
		})
	)
}

// chunk calls so we do not exceed the gas limit
// const CALL_CHUNK_SIZE = 500

/**
 * Fetches a chunk of calls, enforcing a minimum block number constraint
 * @param multicallContract multicall contract to fetch against
 * @param chunk chunk of calls to make
 * @param minBlockNumber minimum block number of the result set
 */
async function fetchChunk(
	multicallContract: Contract,
	chunk: Call[],
	minBlockNumber: number | undefined = undefined,
	account: string | undefined = undefined
): Promise<{ results: string[]; blockNumber: number }> {
	const [resultsBlockNumber, returnData] =
		account && multicallContract.signer
			? await multicallContract.aggregate(
					chunk.map((obj) => [obj.address, obj.callData])
			  ) // eslint-disable-line no-mixed-spaces-and-tabs
			: await multicallContract.callStatic.aggregate(
					chunk.map((obj) => [obj.address, obj.callData])
			  ) // eslint-disable-line no-mixed-spaces-and-tabs

	if (minBlockNumber && resultsBlockNumber.toNumber() < minBlockNumber) {
		throw new Error('Fetched for old block number')
	}
	return { results: returnData, blockNumber: resultsBlockNumber.toNumber() }
}
