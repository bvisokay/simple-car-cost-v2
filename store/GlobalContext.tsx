import React, { createContext } from "react"
import { useImmerReducer } from "use-immer"

export const GlobalDispatchContext = createContext((() => {}) as React.Dispatch<GlobalActionTypes>)

export const GlobalStateContext = createContext({
  loggedIn: false,
  user: { username: null, usertoken: null, _id: null },
  flashMessages: [] as any,
  language: "",
  theme: ""
})

type GlobalActionTypes = { type: "login"; value: any } | { type: "logout" } | { type: "flashMessage"; value: string } | { type: "setEnglish" } | { type: "setSpanish" } | { type: "setLatin" } | { type: "setLightTheme" } | { type: "setDarkTheme" }

export const GlobalContextProvider: React.FC = props => {
  const initialState = {
    loggedIn: false,
    flashMessages: [] as any,
    user: {
      usertoken: null,
      username: null,
      _id: null
      //token: localStorage.getItem("simpleCarCostToken"),
      //username: localStorage.getItem("simpleCarCostUsername")
    },
    language: "english",
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
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
      case "setEnglish":
        draft.language = "english"
        return
      case "setSpanish":
        draft.language = "spanish"
        return
      case "setLatin":
        draft.language = "latin"
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
