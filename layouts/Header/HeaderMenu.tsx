import { FC, memo, useCallback } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import cn from 'classnames'
import styled from 'styled-components'

export const StyledHeaderMenu = styled.ul`
	a {
		text-decoration: none;
	}
	&.menu {
		display: flex;
		justify-content: center;
		padding: 0;
		margin: 0;
		> li {
			display: flex;
			align-items: center;
			+ li {
				margin-left: 48px;
			}
			a {
				display: inline-block;
				position: relative;
				padding-top: 10px;
				padding-bottom: 10px;
				font-weight: 700;
				color: ${({ theme }) => theme?.colors?.gray4 || ''};
				&:before {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					width: 0;
					height: 2px;
					background: linear-gradient(310deg, #cb7fcc 25%, #fc52ff 100%);
					transform: translateX(-50%);
					transition: 0.2s linear all;
				}
				&:hover {
					color: #fff;
					&:before {
						width: 28px;
						transition: 0.2s linear all;
					}
				}
			}
			&.active {
				a {
					color: #fff;
					&:before {
						width: 28px;
					}
				}
			}
		}
		@media screen and (max-width: 1199px) {
			> li {
				+ li {
					margin-left: 40px;
				}
			}
		}
	}
	&.menu--mobile {
		display: block;
		> li {
			display: block;
			padding-bottom: 13px;
			+ li {
				padding-top: 13px;
				margin: 0;
			}
			&:first-child {
				a {
					padding-top: 0;
				}
			}
			a {
				display: block;
				&:before {
					left: 0;
					transform: translateX(0);
				}
			}
		}
	}
`

const menus = [
	{ key: 'home', title: 'HOME', route: '/' },
	{ key: 'trade', title: 'PIGSWAP', route: '/trade' },
	{ key: 'dao', title: 'PIGDAO', route: '/dao' },
	{ key: 'iro', title: 'PIGIRO', route: '/iro' },
	{ key: 'market-place', title: 'NFT MARKETPLACE', route: '/marketplace' }
	// { key: 'our-team', title: 'Our Team', route: '/our-team' },
	// { key: 'whitepaper', title: 'Whitepaper', route: '/whitepaper' }
]

export interface HeaderMenuProps {
	className?: string
}

const HeaderMenu: FC<HeaderMenuProps> = ({ ...props }) => {
	const router = useRouter()
	const activeFunction = useCallback(
		(compareRouter: string) => {
			return router.asPath === compareRouter
		},
		[router.asPath]
	)

	return (
		<StyledHeaderMenu {...props} className={cn('menu', props?.className)}>
			{menus.map((menu) => (
				<li
					key={menu.key}
					className={cn({ active: activeFunction(menu.route) })}>
					<Link href={menu.route} passHref>
						<a>{menu.title}</a>
					</Link>
				</li>
			))}
		</StyledHeaderMenu>
	)
}

export default memo(HeaderMenu)
