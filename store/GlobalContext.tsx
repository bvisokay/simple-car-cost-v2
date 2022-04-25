import React, { createContext } from "react"
import { useImmerReducer } from "use-immer"

export const GlobalDispatchContext = createContext((() => {}) as React.Dispatch<GlobalActionTypes>)

export const GlobalStateContext = createContext({
  // helps get good autocompletion
  loggedIn: false,
  user: { username: "", _id: "" },
  flashMessages: [] as any,
  theme: ""
})

type GlobalActionTypes = { type: "login"; value: any } | { type: "logout" } | { type: "updateUser"; value: any } | { type: "flashMessage"; value: string } | { type: "setLightTheme" } | { type: "setDarkTheme" }

export const GlobalContextProvider: React.FC = props => {
  const initialState = {
    loggedIn: false,
    flashMessages: [] as any,
    user: {
      username: "",
      _id: ""
      //token: localStorage.getItem("simpleCarCostToken"),
      //username: localStorage.getItem("simpleCarCostUsername")
    },
    theme: "dark"
  }

  function ourReducer(draft: typeof initialState, action: GlobalActionTypes): void {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.value
        return
      case "logout":
        draft.loggedIn = false
        return
      case "updateUser":
        draft.user.username = action.value.user?.username
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
        throw new Error("Bad action")
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>{props.children}</GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  )
}
