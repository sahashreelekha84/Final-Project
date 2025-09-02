const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class PaymentController{
 async createCheckout  (req, res)  {
  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      { price: process.env.STRIPE_PLAN_ID, quantity: 1 }
    ],
    mode: "subscription",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.json({ url: session.url });
}
}
module.export=new PaymentController()