import { Web3ReactProvider } from '@web3-react/core'

import { AppProps } from 'next/app'
import Head from 'next/head'

import { ApolloProvider } from '@apollo/client'
import { Web3Provider } from '@ethersproject/providers'
import { Loading } from 'components'
import Footer from 'layouts/Footer'
import Header from 'layouts/Header'
import Main from 'layouts/Main'
import { client } from 'services/apollo/client'
import { ThemeProvider } from 'styled-components'
import { GlobalStyled } from 'styles'
import { theme } from 'styles/theme'

import '../styles/index.css'

const getLibrary = (provider: any) => {
	const library = new Web3Provider(provider)
	library.pollingInterval = 12000
	return library
}

function _App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>{pageProps.title}</title>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
			</Head>
			<ThemeProvider theme={{ ...theme }}>
				<GlobalStyled />
				<Loading>
					<ApolloProvider client={client}>
						<Web3ReactProvider getLibrary={getLibrary}>
							<Header />
							<Main>
								<>
									<Component {...pageProps} />
								</>
							</Main>
							<Footer />
						</Web3ReactProvider>
					</ApolloProvider>
				</Loading>
			</ThemeProvider>
		</>
	)
}

export default _App
