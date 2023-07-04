import { motion } from "framer-motion"
import Head from "next/head"
// comps
import CarImage from "../components/CarImage"
import TestDrive from "../components/TestDrive/TestDrive"

// styled comps
import { WrapperNarrow } from "../styles/GlobalComponents"
import Hero from "../components/Hero/Hero"

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Simple Car Cost</title>
      </Head>
      <WrapperNarrow>
        <Hero />
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

        <TestDrive />
      </WrapperNarrow>
    </>
  )
}
