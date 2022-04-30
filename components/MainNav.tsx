import styled from "styled-components"
import { Btn } from "../styles/GlobalComponents"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession, signOut } from "next-auth/client"

const MainNavContainer = styled.div`
  display: flex;
  justify-content: end;
`

const MainNav = () => {
  //const [session, loading] = useSession()
  const [session] = useSession()
  const router = useRouter()

  console.log("session", session)

  // log user out on click
  function logoutHandler() {
    // was .replace but sending back to /profile?
    signOut()
    router.push("/")
  }

  return (
    <MainNavContainer>
      {/* Was !session and !loading */}
      {!session && (
        <>
          <Link href="/login">
            <Btn>Log In</Btn>
          </Link>
          <Link href="/register">
            <Btn color={"var(--teal)"}>Register</Btn>
          </Link>
        </>
      )}

      {session && (
        <>
          <Link href="/dashboard">
            <Btn color={"var(--indigo)"}>Dashboard</Btn>
          </Link>
          <Link href="/create-item">
            <Btn color={"var(--cyan)"}>Add Car</Btn>
          </Link>
          <Link href="/user/list">
            <Btn color={"var(--teal)"}>My List</Btn>
          </Link>
          <Btn onClick={() => logoutHandler()} color={"var(--secondary)"}>
            Log Out
          </Btn>
        </>
      )}
    </MainNavContainer>
  )
}
export default MainNav
