import Link from "next/link"
import { Display, WrapperNarrow } from "../styles/GlobalComponents"
import styled from "styled-components"
import Head from "next/head"

const FlexParent = styled.div`
  display: flex;
  height: 400px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  //border: 2px solid purple;
`

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>Not Found | Simple Car Cost</title>
      </Head>
      <WrapperNarrow>
        <FlexParent>
          <Display>Not Found</Display>
          <div>
            Head back to the <Link href="/">homepage</Link> for a fresh start.
          </div>
        </FlexParent>
      </WrapperNarrow>
    </>
  )
}
export default NotFoundPage
