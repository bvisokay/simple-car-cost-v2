import styled from "styled-components"
import { Btn } from "../styles/GlobalComponents"
import Link from "next/link"
import { useContext } from "react"
import { GlobalDispatchContext, GlobalStateContext } from "../store/GlobalContext"
import { useRouter } from "next/router"

const MainNavContainer = styled.div`
  display: flex;
  justify-content: end;
`

const MainNav = () => {
  const router = useRouter()
  const appDispatch = useContext(GlobalDispatchContext)
  const appState = useContext(GlobalStateContext)

  async function logoutHandler() {
    const response = await fetch("/api/logout")
    const data = await response.json()
    appDispatch({ type: "logout" })
    if (window !== undefined) {
      localStorage.removeItem("simpleCarCostUsername")
      localStorage.removeItem("simpleCarCostLoggedIn")
    }
    console.log(data)
    router.replace("/")
  }

  return (
    <MainNavContainer>
      {!appState.loggedIn && (
        <>
          <Link href="/login">
            <Btn>Log In</Btn>
          </Link>
          <Link href="/register">
            <Btn color={"var(--teal)"}>Register</Btn>
          </Link>
        </>
      )}

      {appState.loggedIn && (
        <>
          <Btn onClick={() => logoutHandler()} color={"var(--indigo)"}>
            Logout
          </Btn>
        </>
      )}
    </MainNavContainer>
  )
}
export default MainNav
