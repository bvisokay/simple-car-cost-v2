import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { runServerSidePageGuard } from "../lib/auth"
import Link from "next/link"
//comps
import { Wrapper, Section } from "../styles/GlobalComponents"

const DashboardPage = (props: any) => {
  return (
    <Wrapper>
      <Section>
        <h2>Welcome {props.session.user.name.charAt(0).toUpperCase() + props.session.user.name.slice(1)}</h2>
        <hr />
        <br />
        <Link href="/create-item">
          <a>Add a new item</a>
        </Link>
        <br />
        <Link href="/list">
          <a>View your list</a>
        </Link>
        <br />
        <Link href="/settings">
          <a>Update your settings</a>
        </Link>
        <br />
        <Link href="/change-password">
          <a>Update your password</a>
        </Link>
        <br />
        <Link href="/learn-more">
          <a>Learn More</a>
        </Link>
      </Section>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await runServerSidePageGuard(context)
  return session
}

export default DashboardPage
