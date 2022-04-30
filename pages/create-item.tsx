import { runServerSidePageGuard } from "../lib/auth"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

const CreateItemPage = (props: any) => {
  return <h2>Welcome {props.session.user.name}</h2>
}
export default CreateItemPage

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await runServerSidePageGuard(context)
  return session
}
