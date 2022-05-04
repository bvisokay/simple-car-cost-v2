import React, { createContext } from "react"
import { useImmerReducer } from "use-immer"

export const GlobalDispatchContext = createContext((() => {}) as React.Dispatch<GlobalActionTypes>)

export const GlobalStateContext = createContext({
  flashMessages: [] as any,
  theme: ""
})

type GlobalActionTypes = { type: "flashMessage"; value: string | string[] } | { type: "setLightTheme" } | { type: "setDarkTheme" }

export const GlobalContextProvider: React.FC = props => {
  const initialState = {
    flashMessages: [] as any,
    theme: "dark"
  }

  function ourReducer(draft: typeof initialState, action: GlobalActionTypes): void {
    switch (action.type) {
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
