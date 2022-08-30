import { FC } from 'react'

import Link from 'next/link'

import TelegramIcon from '@mui/icons-material/Telegram'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Container, Divider, Tooltip } from '@mui/material'
import DiscordIcon from 'public/images/Discord.svg'
import styled from 'styled-components'
import { StyledLogo, TermContainer } from 'styles'

import { FooterStyled } from './Footer.styled'

const SocialIcons = styled.div`
	position: fixed;
	bottom: 10px;
	right: 10px;
	z-index: 999;
	display: flex;
	flex-direction: column;
	algin-center;
	background: linear-gradient(310deg, #cb7fcc 25%, #fc52ff 100%);
	padding: 8px;
	border-radius: 15px;
	svg {
		margin: 8px 0;
		cursor: pointer;
		border-radius: 50%;
		max-width: 20px;
		height: auto;
		&:hover {
			opacity: 0.8;
		}
	}
`

const Footer: FC = () => {
	return (
		<FooterStyled>
			<Container>
				<div className="footer-logo">
					<div className="logo-container">
						<Link href="/" passHref>
							<StyledLogo>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src="/logo.png" alt="Logo" className="image" />
							</StyledLogo>
						</Link>
					</div>
				</div>
				<div className="footer-term">
					<TermContainer>
						<li>
							<Link href="/terms-of-use">
								<a>Terms of Use</a>
							</Link>
						</li>
						<li>
							<Link href="/privacy-policy">
								<a>Privacy Policy</a>
							</Link>
						</li>
					</TermContainer>
				</div>
				<Divider className="divider" />
				<div className="footer-version">
					<p className="footer-description">
						© {new Date().getFullYear()} PinkPiggy
					</p>
				</div>
			</Container>
			<SocialIcons>
				<a href="https://discord.gg/rGXYeVQVkD" target={'_blank'}>
					<Tooltip title="Discord">
						<div>
							<DiscordIcon />
						</div>
					</Tooltip>
				</a>
				<a
					href="https://www.youtube.com/channel/UCnl5C9wqRAQxAfc4F-e25Mw"
					target={'_blank'}>
					<Tooltip title="Youtube">
						<YouTubeIcon sx={{ color: 'white' }} />
					</Tooltip>
				</a>
				<a href="https://twitter.com/ppiggyfinance" target={'_blank'}>
					<Tooltip title="Twitter">
						<TwitterIcon sx={{ color: 'white' }} />
					</Tooltip>
				</a>
				<a href="https://t.me/pinkpigyfinace" target={'_blank'}>
					<Tooltip title="Telegram">
						<TelegramIcon sx={{ color: 'white' }} />
					</Tooltip>
				</a>
				<a href="https://t.me/pinkpiggychanel" target={'_blank'}>
					<Tooltip title="Telegram Channel">
						<TelegramIcon sx={{ color: 'white' }} />
					</Tooltip>
				</a>
			</SocialIcons>
		</FooterStyled>
	)
}

export default Footer
