import { Display, LeadMuted, Btn } from "../../styles/GlobalComponents"
import Link from "next/link"

const Hero = () => {
  return (
    <>
      <Display>A Simple Way to Compare Vehicle Prices</Display>
      <LeadMuted>
        The typical vehicle listing is missing some very important information. Summarize a vehicle&apos;s price into a simple &ldquo;cost per remaining month&rdquo; based on how much driving you do and other basic assumptions.
        <br />
        <br />
        <Link href="/register">
          <Btn bgColor={"var(--cyan)"} hoverBg={"var(--alt-cyan)"}>
            Get Started
          </Btn>
        </Link>
        <Link href="/overview">
          <Btn bgColor={"var(--indigo)"} hoverBg={"var(--alt-indigo)"}>
            Learn More
          </Btn>
        </Link>
      </LeadMuted>
    </>
  )
}
export default Hero
