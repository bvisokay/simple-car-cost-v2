import type { AppProps } from "next/app"
import Layout from "../components/Layout"

// Styles
import { GlobalStyles } from "../styles/globalstyles"

// Context Files moved to layout to avoid running on server
// if window !=== undefined check for localStorage...
// throws "Text content did not match" Error Warning
import { GlobalContextProvider } from "../store/GlobalContext"

// affect nested of flex container / wrapper so revisit

export const SITENAME: string = "Simple Car Cost"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <GlobalStyles />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalContextProvider>
  )
}
export default MyApp
