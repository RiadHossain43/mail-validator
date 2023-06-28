const { stripe } = require("../../.config/stripe");
const { Manager } = require("./manager");
class Pricing extends Manager {
  constructor() {
    super();
  }
  async getPricingInformation() {
    const price = await stripe.prices.retrieve(process.env.STRIPE_ALICE_PRICE);
    const product = await stripe.products.retrieve(price.product);
    return { price, product };
  }
}
module.exports = { Pricing };
