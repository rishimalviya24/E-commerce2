//controller/paymentController.js
import paypal from "../config/paypal.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

export const createPaypalOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    //calculaltel total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      const itemsTotal = product.price * item.quantity;
      totalAmount += itemsTotal;

      orderItems.push({
        proudct: product._id,
        quantity: item.quantity,
      });
    }

    const create_payment_json = {
      intent: sale,
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "https://localhost:3000/payment-success",
        cancel_url: "https://localhost:3000/payment-cancel",
      },
      transactions: [
        {
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Order from shopify Clone",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.log(error.response);
        return res
          .status(500)
          .json({ message: "Paypal order creation failed" });
      }
    });
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paypalOrderId: payment.id,
    });

    await user.save();

    const approvalUrl = payment.links.find( 
        (link) => link.rel == "approval_url"
    ).href;

    res.status(200).json({ approvalUrl});
  } catch (err) {
    res.status(500).json({ message : "Payment creation error", error: err.message });
  }
};
