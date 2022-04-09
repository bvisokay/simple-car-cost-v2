import styled from "styled-components"
import { breakpoints } from "../styles/breakpoints"
import Link from "next/link"
import { FaCar } from "react-icons/fa"

const HeaderContainer = styled.div`
  background: var(--primary);
  width: 100%;
`

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-family: var(--font-secondary);
  padding: 1rem;
  max-width: var(--wrapper-width);
  margin: 0 auto;

  @media ${breakpoints.sm} {
    justify-content: space-between;
  }
  @media ${breakpoints.md} {
    flex-direction: row;
    justify-content: space-between;
  }

  a {
    color: white;
    margin: 0;
    padding: 0;
    //border: 1px solid violet;
  }
`

const LogoText = styled.div`
  font-size: 1.25rem;
  padding: 0.5rem 0;

  @media ${breakpoints.xs} {
    font-size: 1.75rem;
  }
`

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 0.5rem;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderWrapper>
        <LogoContainer>
          <Link href="/">
            <IconContainer>
              <FaCar size={35} />
            </IconContainer>
          </Link>
          <Link href="/">
            <LogoText>
              <a>SimpleCarCost</a>
            </LogoText>
          </Link>
        </LogoContainer>

        {/* <MainNav /> */}
        {/* <p>{appState.loggedIn ? "Logged In" : "Logged Out"}</p> */}
        {/*  <LogInOutBtns /> */}
        {/* <GiHamburgerMenu size={24} /> */}
      </HeaderWrapper>
    </HeaderContainer>
  )
}
export default Header
