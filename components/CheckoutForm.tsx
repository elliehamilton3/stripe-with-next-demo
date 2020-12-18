import React, { useState } from 'react'

import StripeTestCards from '../components/StripeTestCards'

import getStripe from '../utils/get-stripejs'
import { fetchPostJSON } from '../utils/api-helpers'

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false)
  // React.FormEventHandler<HTMLFormElement>
  const handleSubmit = (priceId: "oneweek" |"monthly" | "yearly") => async (e: any) => {
    e.preventDefault()
    setLoading(true)
    // Create a Checkout Session.
    const response = await fetchPostJSON('/api/checkout_sessions', {
      priceId
    })

    if (response.statusCode === 500) {
      console.error(response.message)
      return
    }

    // Redirect to Checkout.
    const stripe = await getStripe()
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id,
    })
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message)
    setLoading(false)
  }

  return (
<>
      <StripeTestCards />
      <ul className="card-list">
        <li>
        <form onSubmit={handleSubmit("oneweek")}>
            <a className="card checkout-style-background">
              <h2>£2</h2>
              <h3>7-day trial</h3>
              <button
                className="checkout-style-background"
                type="submit"
                disabled={loading}
              >
                Pay now 
              </button>
            </a>
            </form>
        </li>

        <li>
        <form onSubmit={handleSubmit("monthly")}>
            <a className="card elements-style-background">
              <h2>£5</h2>
              <h3>1 month</h3>       
              <button
                className="elements-style-background"
                type="submit"
                disabled={loading}
              >
                Pay now 
              </button>        
            </a>
            </form>
        </li>

        <li>
        <form onSubmit={handleSubmit("yearly")}>
            <a className="card cart-style-background">
              <h2>£50</h2>
              <h3>1 year</h3>
              <button
                className="cart-style-background"
                type="submit"
                disabled={loading}
              >
                Pay now 
              </button>
            </a>
            </form>
        </li>
      </ul>
      </>
  )
}

export default CheckoutForm
