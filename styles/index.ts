import styled, { createGlobalStyle, css } from 'styled-components'

export const GlobalStyled = createGlobalStyle`
body {
	width: 100vw;
	overflow-x: hidden;
	&.no--scroll {
		overflow: hidden;
	}
}
`

export const StyledLogo = styled.a`
	position: relative;
	display: flex;
	align-items: center;
	height: 45px;
	cursor: pointer;
	&:hover {
		color: #cb7fcc !important;
	}
	img {
		width: 50px;
		aspect-ratio: auto 50 / 50;
		height: 50px;
	}
	div {
		margin-left: 12px;
		font-size: 24px;
	}
	@media screen and (max-width: 500px) {
		div {
			display: none;
		}
	}
`

export const BgGradient = styled.div<{ bgImage?: string }>`
	width: 100%;
	background-image: ${({ bgImage }) =>
		bgImage || 'linear-gradient(136.74deg, #1470d6 1.01%, #cf1fbd 98.87%)'};
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
`

export const BgMatrix = styled.div<{ bgColor?: string }>`
	position: relative;
	width: 100%;
	height: 100%;
	min-height: 350px;
	background-color: ${({ bgColor, theme }) =>
		bgColor || theme?.colors?.darkGrey4} !important;
	&:before {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		width: 390px;
		height: 350px;
		content: '';
	}
	&:after {
		position: absolute;
		z-index: 1;
		top: 0;
		right: 0;
		width: 390px;
		height: 350px;
		content: '';
	}
	@media screen and (max-width: 992px) {
		&:before {
			display: none;
		}
		&:after {
			display: none;
		}
	}
`

export const BgMatrixRight = styled.div<{ bgColor?: string }>`
	position: relative;
	width: 100%;
	height: 100%;
	min-height: 350px;
	background-color: ${({ bgColor, theme }) =>
		bgColor || theme?.colors?.darkPurple4} !important;

	&:after {
		position: absolute;
		z-index: 1;
		top: 0;
		right: 0;
		width: 390px;
		height: 350px;
		background: left / cover no-repeat url('/images/bg-matrix-right.png');
		content: '';
	}
	@media screen and (max-width: 992px) {
		&:before {
			display: none;
		}
		&:after {
			display: none;
		}
	}
`

export const Section = styled.section<{ paddingVertical?: number }>`
	padding-top: ${({ paddingVertical }) =>
		(typeof paddingVertical === 'number' ? paddingVertical : 100) + 'px'};
	padding-bottom: ${({ paddingVertical }) =>
		(typeof paddingVertical === 'number' ? paddingVertical : 100) + 'px'};
	background-color: ${({ theme }) => theme?.colors?.darkPurple4};
	color: ${({ theme }) => theme?.colors?.white || '#fff'};
	@media screen and (max-width: 1700px) {
		padding-top: ${({ paddingVertical }) =>
			(typeof paddingVertical === 'number'
				? (paddingVertical as number) / 1.2
				: 80) + 'px'};
		padding-bottom: ${({ paddingVertical }) =>
			(typeof paddingVertical === 'number'
				? (paddingVertical as number) / 1.2
				: 80) + 'px'};
	}
	@media screen and (max-width: 1400px) {
		padding-top: ${({ paddingVertical }) =>
			(typeof paddingVertical === 'number'
				? (paddingVertical as number) / 1.44
				: 70) + 'px'};
		padding-bottom: ${({ paddingVertical }) =>
			(typeof paddingVertical === 'number'
				? (paddingVertical as number) / 1.44
				: 70) + 'px'};
	}
	@media screen and (max-width: 992px) {
		padding-top: ${({ paddingVertical }) =>
			(typeof paddingVertical === 'number'
				? (paddingVertical as number) / 1.728
				: 60) + 'px'};
		padding-bottom: ${({ paddingVertical }) =>
			(typeof paddingVertical === 'number'
				? (paddingVertical as number) / 1.728
				: 60) + 'px'};
	}
`

export const TermContainer = styled.ul`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	margin: -5px -12px;
	list-style: none;
	> li {
		padding: 5px 12px;
		a {
			color: ${({ theme }) => theme?.colors?.gray4};
			text-decoration: none;
		}
	}
`

export const cssBorderGradientHover = css`
	position: relative;
	z-index: 0;
	&:before {
		position: absolute;
		z-index: -2;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		opacity: 0;
		background-image: linear-gradient(310deg, #cb7fcc 25%, #fc52ff 100%);
		border-radius: 15px;
		content: '';
		pointer-events: none;
		transition: 0.2s linear all;
	}
	&:after {
		position: absolute;
		z-index: -1;
		top: 1px;
		right: 1px;
		bottom: 1px;
		left: 1px;
		background-color: ${({ theme }) => theme?.colors?.darkGrey4};
		border-radius: 15px;
		content: '';
		pointer-events: none;
		transition: 0.25s ease all;
	}
	&:hover {
		&:before {
			opacity: 1;
			transition: 0.2s linear all;
		}
	}
`
