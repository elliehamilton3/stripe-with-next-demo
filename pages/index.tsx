import { NextPage } from 'next'
import Layout from '../components/Layout'
import Link from 'next/link'

const IndexPage: NextPage = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <ul className="card-list">
        <li>
        <Link href="/donate-with-checkout">
            <a className="card checkout-style-background">
              <h2>Pricing</h2>
              <h3>View our pricing options</h3>
              <img src="/checkout-one-time-payments.svg" />
            </a>
            </Link>
        </li>
      </ul>
    </Layout>
  )
}

export default IndexPage
