const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../model/Rg"); // your schema path

// PAYSTACK WEBHOOK MIDDLEWARE
const paystackWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  // ✅ Verify Paystack signature
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const event = req.body;

  console.log("Paystack  ",event)
  // ✅ Listen for successful incoming transfer (Paystack event)
  if (event.event === "transfer.success") {
    const { amount, recipient, reference } = event.data;

    // Metadata should contain the user account number or user ID
    const account_no = recipient?.metadata?.account_no;

    if (!account_no) {
      console.log("⚠️ No account_no in metadata");
      return res.status(200).json({ success: true });
    }

    // Convert kobo → naira
    const creditAmount = amount / 100;

    // ✅ Find user by account number
    const user = await User.findOne({ account_no });

    if (!user) {
      console.log(`⚠️ No user found for account ${account_no}`);
      return res.status(200).json({ success: true });
    }

    // ✅ Add to wallet balance (wallet is an array, so we’ll use index 0)
    // if (!user.wallet || user.wallet.length === 0) {
    //   user.wallet = [0];
    // }

    user.wallet.push(creditAmount)

    // ✅ Add a transaction record
    user.transaction.push({
      from: "Paystack",
      to: user.account_name,
      status: "successful",
      product_name: "Wallet Funding",
      amount: creditAmount,
      type: "credit",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      refrenceId: reference,
    });

    await user.save();

    console.log(`✅ Wallet credited: ₦${creditAmount} | Account: ${account_no}`);
  }

  // ✅ Respond to Paystack quickly
  res.status(200).json({ success: true });
});

module.exports = paystackWebhook;
