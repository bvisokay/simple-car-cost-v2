import Link from "next/link"
import styled from "styled-components"
import { Wrapper } from "../styles/GlobalComponents"
import { breakpoints } from "../styles/breakpoints"

const FooterContainer = styled.div`
  background: var(--primary);
  width: 100%;

  ul {
    display: flex;
    padding: 1rem 0;
  }

  li {
    //border: 1px solid red;
    margin: 0 0.5rem;
    padding: 0.5rem;

    a {
      color: #fff;
    }

    a:hover {
      cursor: pointer;
    }
  }

  @media ${breakpoints.xs} {
    font-size: 1rem;
  }
  @media ${breakpoints.md} {
    font-size: 1rem;
  }
`

export default function Footer() {
  return (
    <FooterContainer>
      <Wrapper>
        <ul>
          <li>
            <Link href="#">
              <a>Support</a>
            </Link>
          </li>
          <li>
            <Link href="#">
              <a>About</a>
            </Link>
          </li>
        </ul>
      </Wrapper>
    </FooterContainer>
  )
}
