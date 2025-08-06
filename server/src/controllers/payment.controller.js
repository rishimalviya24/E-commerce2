import paypal from "../config/paypal.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

// ========== CREATE PAYPAL ORDER ==========

export const createPaypalOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      const itemsTotal = product.price * item.quantity;
      totalAmount += itemsTotal;

      orderItems.push({
        product: product._id, // ✅ fixed typo
        quantity: item.quantity,
      });
    }

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/payment-success",
        cancel_url: "http://localhost:3000/payment-cancel",
      },
      transactions: [
        {
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Order from Shopify Clone",
        },
      ],
    };

    // Wrap in a Promise to await
    const payment = await new Promise((resolve, reject) => {
      paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) return reject(error);
        resolve(payment);
      });
    });

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paypalOrderId: payment.id,
    });

    await order.save();

    const approvalLink = payment.links.find((link) => link.rel === "approval_url");
    if (!approvalLink) {
      return res.status(500).json({ message: "Approval URL not found in PayPal response" });
    }

    res.status(200).json({ approvalUrl: approvalLink.href });
  } catch (err) {
    console.error("PayPal Order Error:", err);
    res.status(500).json({ message: "Payment creation error", error: err.message });
  }
};

// ========== EXECUTE PAYPAL PAYMENT ==========

export const executePaypalPayment = async (req, res) => {
  const { paymentId, PayerID } = req.query;

  try {
    const execute_payment_json = {
      payer_id: PayerID,
    };

    const payment = await new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if (error) return reject(error);
        resolve(payment);
      });
    });

    const order = await Order.findOne({ paypalOrderId: paymentId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();

    res.redirect("http://localhost:3000/order-success");
  } catch (err) {
    console.error("PayPal Execute Error:", err);
    res.status(500).json({ message: "Payment capture failed", error: err.message });
  }
};
