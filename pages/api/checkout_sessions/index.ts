import { NextApiRequest, NextApiResponse } from 'next'

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-03-02',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      let price;
      const trial:any[] = [];
      if(req.body.priceId === "oneweek") { 
        price = process.env.WEEK_PRICE_ID 
        trial.push( {
          price: process.env.MONTHLY_PRICE_ID ,
          quantity: 1,
          
        })
      };
      if(req.body.priceId === "monthly") price = process.env.MONTHLY_PRICE_ID;
      if(req.body.priceId === "yearly") price = process.env.YEARLY_PRICE_ID;
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price,
            quantity: 1,      
          },
          ...trial
        ],
        subscription_data: {trial_period_days: 7},
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/donate-with-checkout`,
      }
      // console.log(params)
      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
        params
      )

      res.status(200).json(checkoutSession)
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
