
const stripe=require("../config/stripe.config")
const createCheckoutSession = async (req, res) => {
  try {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Orders" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://grubquest.vercel.app/orders`,
      cancel_url: `https://grubquest.vercel.app/cart`,
      //   metadata: {
      //     billId,
      //   },
    });

    res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error:${error.message}`,
    });
  }
};

module.exports = { createCheckoutSession };