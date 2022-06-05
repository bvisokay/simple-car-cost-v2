import { useContext } from "react"
import { GlobalStateContext } from "../store/GlobalContext"

const FlashMessages: React.FC = () => {
  const appState = useContext(GlobalStateContext)

  return (
    <div className="floating-alerts">
      {appState.flashMessages.map((msg: string, index: number) => {
        return (
          <div key={index} className="floating-alert">
            {msg}
          </div>
        )
      })}
    </div>
  )
}
export default FlashMessages
