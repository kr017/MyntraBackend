const Cart = require("../models/cart");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

const stripe = require("stripe")(
  "sk_test_51JcWeNSIbA2UPd9FD3kUsHFZiwMLL0dkiGI7YhQPE5ShqdnQUawRJ1kh7A9aaNp5L5ai4b5bNkwR0iTasNnE0vRg00pANgc3NV"
);

module.exports = {
  placeOrder: async (req, res) => {
    try {
      let user = await User.findById(req.user._id);
      if (user.stripe_id) {
        let charge = await stripe.charges.create(
          {
            amount: parseInt(200) * 100,
            currency: "INR",
            customer: user.stripe_id,
            shipping: {
              name: user.name,
              address: {
                country: req.body.card.country,
              },
            },
          },
          { idempotencyKey: uuidv4() }
        );
        console.log(charge);
        if (charge) {
          return res.json({
            status: "success",
          });
        } else {
          throw { message: "Something went wrong" };
        }
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          source: req.body.id,
        });

        if (customer) {
          let updatedUser = await User.findByIdAndUpdate(req.user._id, {
            stripe_id: customer.id,
          });

          let charge = await stripe.charges.create(
            {
              amount: parseInt(200) * 100,
              currency: "INR",
              customer: customer.id,
              shipping: {
                name: user.name,
                address: {
                  country: req.body.card.country,
                },
              },
            },
            { idempotencyKey: uuidv4() }
          );
          console.log(charge);
          if (charge) {
            return res.json({
              status: "success",
            });
          } else {
            throw { message: "Something went wrong" };
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};
