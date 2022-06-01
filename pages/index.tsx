import Link from "next/link"
import Head from "next/head"
import { SITENAME } from "./_app"

// comps
import CarImage from "../components/CarImage"
//import TestDrive from "../components/TestDrive"

// styled comps
import { WrapperNarrow, Display, LeadMuted, Btn } from "../styles/GlobalComponents"

export default function Home() {
  return (
    <>
      <Head>
        <title>{SITENAME}</title>
        <meta name="description" content="A simple way to compare a car's cost" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WrapperNarrow>
        <Display>A Simple Way to Compare Vehicle Prices</Display>
        <LeadMuted>
          The typical vehicle listing is missing some very important information. Summarize a vehicle's price into a simple "cost per remaining month" based on how much driving you do and other basic assumptions.
          <br />
          <br />
          <Link href="/register">
            <Btn bgColor={"var(--cyan)"}>Get Started</Btn>
          </Link>
          <Link href="/overview">
            <Btn bgColor={"var(--indigo)"}>Learn More</Btn>
          </Link>
        </LeadMuted>

        <CarImage />

        {/* <TestDrive /> */}
      </WrapperNarrow>
    </>
  )
}
