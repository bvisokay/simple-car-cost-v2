import styled from "styled-components"
import { Btn } from "../styles/GlobalComponents"

const MainNavContainer = styled.div`
  display: flex;
  justify-content: end;
`

const MainNav = () => {
  return (
    <MainNavContainer>
      <Btn>Login</Btn>
      <Btn color={"var(--teal)"}>Register</Btn>
    </MainNavContainer>
  )
}
export default MainNav
