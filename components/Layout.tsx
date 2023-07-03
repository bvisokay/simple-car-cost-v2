//import { useContext } from "react"
import styled from "styled-components"
//import { GlobalDispatchContext } from "../store/GlobalContext"

// comps
import Header from "./Header"
import Footer from "./Footer"
import FlashMessages from "./FlashMessages"

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100%;
  min-height: 100vh;
  flex-direction: column;
  //border: 1px solid red;
  margin: 0 auto;
  position: relative;
`

const Container = styled.div`
  flex: 1;
  padding: 1rem;
  border: var(--border-width) solid #999;
  width: 100%;
  max-width: var(--wrapper-width);
  margin: 0 auto;
  min-width: 100%;
  //display: flex;
  //flex-direction: column;
`

type LayoutProps = {
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = props => {
  //const appDispatch = useContext(GlobalDispatchContext)

  return (
    <LayoutContainer>
      <FlashMessages />
      <Header />
      <Container>{props.children}</Container>
      <Footer />
    </LayoutContainer>
  )
}

export default Layout
