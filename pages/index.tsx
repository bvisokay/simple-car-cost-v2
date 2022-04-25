import Link from "next/link"
import Head from "next/head"
import { SITENAME } from "./_app"
import { getJWTPayload } from "../lib/auth"

// comps
import CarImage from "../components/CarImage"
import TestDrive from "../components/TestDrive"

// styled comps
import { WrapperNarrow, Display, LeadMuted } from "../styles/GlobalComponents"

export default function Home(props: any) {
  return (
    <>
      <Head>
        <title>{SITENAME}</title>
        <meta name="description" content="A simple way to compare a car's cost" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WrapperNarrow>
        <p style={{ textAlign: "right", fontSize: ".7rem" }}>{props.user ? `User: ${props.user.charAt(0).toUpperCase(0) + props.user.slice(1)}` : "n/a"}</p>
        <Display>A Simple Way to Compare Vehicle Prices</Display>
        <LeadMuted>
          The typical vehicle listing is missing some very important information. Summarize a vehicle's price into a simple "cost per remaining month" value based on how much driving you do and other basic assumptions.{" "}
          <Link href="/overview">
            <a>Learn more...</a>
          </Link>
        </LeadMuted>
        <CarImage />
        <TestDrive />
      </WrapperNarrow>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const user = await getJWTPayload(context)

  return {
    props: {
      user
    }
  }
}
