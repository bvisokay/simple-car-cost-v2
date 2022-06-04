import Link from "next/link"
import { motion } from "framer-motion"
import Head from "next/head"
// comps
import CarImage from "../components/CarImage"
import TestDrive from "../components/TestDrive"

// styled comps
import { WrapperNarrow, Display, LeadMuted, Btn } from "../styles/GlobalComponents"

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Simple Car Cost</title>
      </Head>
      <WrapperNarrow>
        <Display>A Simple Way to Compare Vehicle Prices</Display>
        <LeadMuted>
          The typical vehicle listing is missing some very important information. Summarize a vehicle&apos;s price into a simple &ldquo;cost per remaining month&rdquo; based on how much driving you do and other basic assumptions.
          <br />
          <br />
          <Link href="/register">
            <Btn bgColor={"var(--cyan)"}>Get Started</Btn>
          </Link>
          <Link href="/overview">
            <Btn bgColor={"var(--indigo)"}>Learn More</Btn>
          </Link>
        </LeadMuted>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              scale: 0.8,
              opacity: 0
            },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.4
              }
            }
          }}
        >
          <CarImage />
        </motion.div>

        {/* <TestDrive /> */}
      </WrapperNarrow>
    </>
  )
}
