import styled from "styled-components"
import { Btn } from "../styles/GlobalComponents"
import Link from "next/link"

const MainNavContainer = styled.div`
  display: flex;
  justify-content: end;
`

const MainNav = () => {
  return (
    <MainNavContainer>
      <Link href="/login">
        <Btn>Log In</Btn>
      </Link>
      <Link href="/register">
        <Btn color={"var(--teal)"}>Register</Btn>
      </Link>
    </MainNavContainer>
  )
}
export default MainNav
