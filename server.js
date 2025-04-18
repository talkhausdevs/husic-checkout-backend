import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe(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);

app.use(cors());
app.use(express.json());

const priceMap = {
  StarterMonthly: "price_1RF5ySGBF0BvUYriaFtIhtfn",
  StarterYearly: "price_1RF5uuGBF0BvUYriLMOmZcSP",
  ProMonthly: "price_1RF60AGBF0BvUYriYu1rmSU5",
  ProYearly: "price_1RF5w5GBF0BvUYri28m8vkbX",
  PremiumMonthly: "price_1RF60YGBF0BvUYrizzKPPy3P",
  PremiumYearly: "price_1RF5wvGBF0BvUYrinKa7FNZJ",
};

app.post("/create-checkout-session", async (req, res) => {
  const { plan } = req.body;
  const priceId = priceMap[plan];

  if (!priceId) return res.status(400).send("Invalid plan selected.");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://talkhausdevs.github.io/husic-landing/browse.html?success=true",
      cancel_url: "https://talkhausdevs.github.io/husic-landing/pricing.html?canceled=true",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => console.log("Stripe server running on port 4242"));
