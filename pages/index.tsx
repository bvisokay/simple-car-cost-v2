import Link from "next/link"
import Head from "next/head"
import { SITENAME } from "./_app"

import { Wrapper } from "../styles/GlobalComponents"

export default function Home() {
  return (
    <>
      <Head>
        <title>{SITENAME}</title>
        <meta name="description" content="A simple way to compare a car's cost" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wrapper>
        <h2>A Simple Way to Compare Vehicle Prices</h2>
        <p>
          The typical vehicle listing is missing some very important information. Summarize a vehicle's price into a simple "cost per remaining month" value based on how much driving you do and other basic assumptions.<Link href="#">Learn more...</Link>
        </p>
      </Wrapper>
    </>
  )
}
