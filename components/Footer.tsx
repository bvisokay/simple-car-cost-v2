import Link from "next/link"
import styled from "styled-components"
import { Wrapper } from "../styles/GlobalComponents"
import { breakpoints } from "../styles/breakpoints"
import { SITENAME } from "../pages/_app"

const FooterContainer = styled.div`
  background: var(--dark);
  width: 100%;

  ul {
    display: flex;
    justify-content: center;
    padding: 1rem 0 0.25rem 0;
    text-align: center;
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

  p {
    padding: 0 1rem;
    text-align: center;
    color: var(--gray);
  }

  a.photo-creds {
    color: var(--gray);
    text-decoration: underline;
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
        <p className="white">
          Photo Credit:{" "}
          <a className="photo-creds" href="https://www.vecteezy.com/vector-art/550435-stylized-convertible-sports-car">
            Brian Goff
          </a>
        </p>
        <p className="white">
          Copyright &copy; {new Date().getFullYear()} {SITENAME} | All Rights Reserved
        </p>
      </Wrapper>
    </FooterContainer>
  )
}
