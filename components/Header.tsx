import styled from "styled-components"
import { breakpoints } from "../styles/breakpoints"
import Link from "next/link"
import { FaCar } from "react-icons/fa"

// comps
import MainNav from "./MainNav"

const HeaderContainer = styled.div`
  background: var(--dark);
  width: 100%;
`

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-family: var(--font-secondary);
  max-width: var(--wrapper-width);
  padding: 1rem;
  margin: 0 auto;

  @media ${breakpoints.sm} {
    justify-content: space-between;
  }
  @media ${breakpoints.md} {
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem;
  }
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  //border: 2px solid gray;
  width: 100%;
  color: white;

  @media ${breakpoints.sm} {
    width: auto;
    //color: var(--primary);
  }

  a {
    color: white;
    margin: 0;
    padding: 0;
    font-family: var(--font-secondary);
    font-size: 1.5rem;
    font-weight: 700;

    @media ${breakpoints.xs} {
      font-size: 2rem;
      //color: var(--primary);
    }

    :hover {
      text-decoration: none;
      cursor: pointer;
    }

    :visited {
      color: white;
    }
  }

  a.logo-icon {
    //border: 1px solid crimson;
    border-radius: var(--roundness);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.5rem;
  }

  svg {
    font-size: 2rem;

    @media ${breakpoints.xs} {
      font-size: 2.5rem;
      //color: var(--primary);
    }

    @media ${breakpoints.md} {
      font-size: 2.75rem;
      //color: var(--primary);
    }

    :hover {
      cursor: pointer;
    }
  }
`

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderWrapper>
        <LogoContainer>
          <Link href="/">
            <a className="logo-icon">
              <FaCar />
            </a>
          </Link>
          <Link href="/">
            <a>SimpleCarCost</a>
          </Link>
        </LogoContainer>

        <MainNav />
      </HeaderWrapper>
    </HeaderContainer>
  )
}
export default Header
