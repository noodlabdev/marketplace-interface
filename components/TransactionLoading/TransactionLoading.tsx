import { FC } from 'react'

import { CircularProgress } from '@mui/material'
import styled from 'styled-components'

const LoadingBackdrop = styled.div`
	position: fixed;
	z-index: -1;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: #000;
	opacity: 0.8;
	pointer-events: inherit;
`

const LoadingWrapper = styled.div`
	position: fixed;
	z-index: 9999;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0;
	pointer-events: none;
	transition: 0.25s all linear;
	img {
		width: 64px;
		height: 64px;
		animation-duration: 2s;
		animation-iteration-count: infinite;
		animation-name: spin;
		animation-timing-function: linear;
	}
`

const LoadingContent = styled.div`
	pointer-events: auto;
`

const LoadingContainer = styled.div`
	&.loading {
		${LoadingContent} {
			pointer-events: none;
		}
		${LoadingWrapper} {
			opacity: 1;
			pointer-events: auto;
			transition: 0.25s all linear;
		}
	}
`

const TransactionLoading: FC<LoadingProps> = ({ loading }) => {
	return (
		<LoadingContainer className={loading ? 'loading' : ''}>
			<LoadingWrapper>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<CircularProgress />
				<LoadingBackdrop />
			</LoadingWrapper>
			{/* <LoadingContent>{children}</LoadingContent> */}
		</LoadingContainer>
	)
}

export interface LoadingProps {
	loading?: boolean
}

export default TransactionLoading
