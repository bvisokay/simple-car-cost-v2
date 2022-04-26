import React, { createContext, useEffect } from "react"
import { useImmerReducer } from "use-immer"

export const GlobalDispatchContext = createContext((() => {}) as React.Dispatch<GlobalActionTypes>)

export const GlobalStateContext = createContext({
  loggedIn: false,
  user: { username: "" },
  flashMessages: [] as any,
  theme: ""
})

type GlobalActionTypes = { type: "login"; value: any } | { type: "logout" } | { type: "flashMessage"; value: string } | { type: "setLightTheme" } | { type: "setDarkTheme" }

export const GlobalContextProvider: React.FC = props => {
  const initialState = {
    loggedIn: false,
    flashMessages: [] as any,
    user: {
      username: ""
    },
    theme: "dark"
  }

  // See if user is logged in on page load
  useEffect(() => {
    //console.log(localStorage.getItem("simpleCarCostLoggedIn"))
    //console.log(localStorage.getItem("simpleCarCostUsername"))

    if (localStorage.getItem("simpleCarCostLoggedIn") == "true" && localStorage.getItem("simpleCarCostUsername") != null) {
      console.log("onLoad page effect ran")
      const loggedInUsername = localStorage.getItem("simpleCarCostUsername")!
      console.log(loggedInUsername)
      dispatch({ type: "login", value: { username: loggedInUsername } })
      console.log("block ran")
    }
  }, [])

  function ourReducer(draft: typeof initialState, action: GlobalActionTypes): void {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.value
        return
      case "logout":
        draft.loggedIn = false
        draft.user.username = ""
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
      case "setLightTheme":
        draft.theme = "light"
        return
      case "setDarkTheme":
        draft.theme = "dark"
        return
      default:
        throw new Error("Bad action of some sort")
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>{props.children}</GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  )
}
