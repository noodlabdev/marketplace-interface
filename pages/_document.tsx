import Document, { DocumentContext } from 'next/document'

import { ServerStyleSheet } from 'styled-components'

export default class _Document extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const sheet = new ServerStyleSheet()
		const originalRenderPage = ctx.renderPage
		const initialProps = await Document.getInitialProps(ctx)

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) =>
						sheet.collectStyles(<App {...props} />)
				})
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				)
			}
		} finally {
			sheet.seal()
		}
	}
}
