import type { AppProps } from "next/app"
import { Provider } from "next-auth/client"
import Layout from "../components/Layout"
import Head from "next/head"
import { useEffect } from "react"
import { useRouter } from "next/router"

// Styles
import { GlobalStyles } from "../styles/globalstyles"

// Context Files moved to layout to avoid running on server
// if window !=== undefined check for localStorage...
// throws "Text content did not match" Error Warning
import { GlobalContextProvider } from "../store/GlobalContext"

import { GA_TRACKING_ID } from "../lib/analytics"

// affect nested of flex container / wrapper so revisit

export const SITENAME: string = "Simple Car Cost"
const isProd = process.env.NODE_ENV === "production"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      if (isProd) {
        window.gtag("config", GA_TRACKING_ID, {
          page_path: url
        })
      }
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return (
    <Provider session={pageProps.session}>
      <GlobalContextProvider>
        <GlobalStyles />
        <Layout>
          <Head>
            <title>{SITENAME}</title>
          </Head>
          <Component {...pageProps} />
        </Layout>
      </GlobalContextProvider>
    </Provider>
  )
}
export default MyApp
