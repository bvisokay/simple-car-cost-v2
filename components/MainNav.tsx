import styled from "styled-components"
import { Btn } from "../styles/GlobalComponents"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession, signOut } from "next-auth/client"
import { motion } from "framer-motion"
import { breakpoints } from "../styles/breakpoints"

import { IoSettings } from "react-icons/io5"

const MainNavContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  margin-top: 0.25rem;

  @media ${breakpoints.xs} {
    margin-top: 0.5rem;
  }

  @media ${breakpoints.md} {
    margin-top: 0;
  }

  a {
    //border: 1px solid red;
    border-radius: 4px;
    margin-left: 0.1rem;
  }

  svg {
    margin: 0.25rem 0.25rem 0 0.25rem;
    fill: var(--gray);
    font-size: 1.5rem;
    //border: 1px solid aqua;
    :hover {
      fill: white;
    }
  }
`

const MainNav = () => {
  //const [session, loading] = useSession()
  const [session] = useSession()
  const router = useRouter()

  //console.log("session", session)

  // log user out on click
  function logoutHandler() {
    // was .replace but sending back to /profile?
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    signOut()
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push("/")
  }

  return (
    <MainNavContainer>
      {/* Was !session and !loading */}
      {!session && (
        <>
          <Link href="/login">
            <Btn hoverColor={"white"}>Log In</Btn>
          </Link>
          <Link href="/register">
            <Btn bgColor={"var(--teal)"} hoverColor={"white"}>
              Register
            </Btn>
          </Link>
        </>
      )}

      {session && (
        <>
          <Link href="/dashboard">
            <Btn bgColor={"var(--indigo)"} hoverColor={"white"}>
              Dashboard
            </Btn>
          </Link>
          <Link href="/create-item">
            <Btn bgColor={"var(--cyan)"} hoverColor={"white"}>
              Add Car
            </Btn>
          </Link>
          <Link href="/list">
            <Btn bgColor={"var(--teal)"} hoverColor={"white"}>
              My List
            </Btn>
          </Link>
          <Btn onClick={() => logoutHandler()} color={"var(--secondary)"} hoverColor={"white"}>
            Log Out
          </Btn>
          <Link href="/settings">
            <motion.a
              whileHover={{
                scale: 1.15,
                transition: {
                  duration: 0.2
                }
              }}
            >
              <IoSettings />
            </motion.a>
          </Link>
        </>
      )}
    </MainNavContainer>
  )
}
export default MainNav
