require("dotenv").config();
const express = require("express");
const app = express();
const Port = process.env.PORT || 4000;
const { Server } = require("socket.io");
const Multer = require("multer");
const Path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connect = require("./Config/connection");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const User = require("./model/Rg");
const opt = require("./Config/cors");
const os = require("os");
const mongoose = require("mongoose");

// ---- Connect MongoDB ----
connect();

// ---- Log System Info ----
function getIPv4() {
  const networkInterfaces = os.networkInterfaces();
  let ipv4s = [];
  Object.keys(networkInterfaces).forEach((ifname) => {
    networkInterfaces[ifname].forEach((iface) => {
      if (iface.family === "IPv4" && !iface.internal) ipv4s.push(iface.address);
    });
  });
  return ipv4s;
}
console.log("IPv4 addresses:", getIPv4());
console.log(os.type(), os.hostname(), os.version(), os.availableParallelism());

// ---- Global CORS & Cookies ----
app.use(cors(opt));
app.use(cookieParser());

// ---- Log all requests ----
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});


// ✅ ---- PAYSTACK WEBHOOK ----
// Use raw body here — required for signature verification
app.post(
  "/paystack/webhook",
  bodyParser.raw({ type: "*/*" }),
  asyncHandler(async (req, res) => {
    console.log("✅ Paystack Webhook triggered!");

    // log entire body to debug
    console.log("🧾 RAW BODY (buffer):", req.body);
    try {
      if (!req.body || !req.body.length) {
        console.log("❌ Empty body received");
        return res.sendStatus(200);
      }

      const secret = process.env.PAYSTACK_KEY;
      const signature = req.headers["x-paystack-signature"];

      if (!signature) {
        console.log("❌ Missing Paystack signature");
        return res.sendStatus(400);
      }

      // Verify signature
      const hash = crypto
        .createHmac("sha512", secret)
        .update(req.body)
        .digest("hex");

      if (hash !== signature) {
        console.log("❌ Invalid signature");
        return res.sendStatus(400);
      }

// Parse the raw body buffer into JSON
const event = JSON.parse(req.body.toString());
console.log("🔥 Event Type:", event.event);
console.log("📦 Event Data:", event.data);

// ✅ Handle Transfer Success
if (event.data.status === "success") {
  const { amount, reference, authorization, metadata } = event.data;

  // ✅ Get receiver account number correctly for dedicated NUBAN
  const account_no = metadata?.receiver_account_number || authorization?.receiver_bank_account_number;
  console.log("💳 Account to credit:", account_no);

  if (!account_no) {
    console.log("⚠️ No account number in metadata");
    return res.sendStatus(200);
  }

  // ✅ Find the user in your database
  const user = await User.findOne({ account_no }).exec();
  if (!user) {
    console.log("⚠️ User not found for account:", account_no);
    return res.sendStatus(200);
  }

  // ✅ Convert kobo to naira
  const creditAmount = amount / 100;

  // ✅ Push new wallet entry
  user.wallet.push(creditAmount);

  // ✅ Add transaction record
  user.transaction.push({
    from: authorization?.sender_name || "Unknown Sender",
    to: user.account_name,
    status: "successful",
    product_name: "Wallet Funding",
    sender_bank: authorization?.sender_bank,
    sender_name: authorization?.sender_name,
    amount: creditAmount,
    type: "credit",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    referenceId: reference,
  });

  await user.save();

  console.log(`✅ Wallet credited ₦${creditAmount} for ${user.account_name}`);
}

    res.sendStatus(200);
      

    } catch (err) {
      console.error("⚠️ Webhook Error:", err.message);
      res.sendStatus(500);
    }
  })
);


// ✅ ---- Normal parsers for other routes ----
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(Path.join(__dirname, "..", "public")));


// ---- Multer Setup ----
const storage = Multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Path.join(__dirname, "..", "Public", "img"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + Path.extname(file.originalname));
  },
});
const upload = Multer({ storage });


// ---- MongoDB Connected ----
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");

  const server = app.listen(Port, () => {
    console.log(`🚀 Server running on port ${Port}`);
  });

  // ---- Socket.io ----
  const io = new Server(server, { cors: { origin: ["*"] } });

  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // ---- Routes ----
  app.use("/Regs", require("./Route/User_con"));
  app.use("/Auth", require("./Route/Auth"));
  app.use("/Getbank", require("./Route/GetBanks"));
  app.use("/list_banks", require("./Route/List_banks"));
  app.use("/opay", require("./Route/get_acc"));
  app.use("/", require("./Route/test"));
  app.use("/Buy_data", require("./Route/Buy_data"));
  app.use("/Verify_smt_tv", require("./Route/verify_smt_tv"));
  app.use("/verify_meter", require("./Route/verify_meter"));
  app.use("/TV_sub", require("./Route/Tv_sub"));
  app.use("/Buy_elec", require("./Route/Buy_elec"));
  app.use("/jamb_verify", require("./Route/Jamb_verify"));
  app.use("/jamb_buy", require("./Route/jamb_buy"));
  app.use("/Weac", require("./Route/Waec"));
  app.use("/getnotify", require("./Route/getnotify"));
  app.use("/getallUser", require("./Route/getAllUsers"));
  app.use("/get_datalist", require("./Route/get_data"));
  app.use("/Add_wallet", require("./Route/add_wallet"));
  app.use("/get_wallet", require("./Route/get_wallet"));
  app.use("/Getbanks", require("./Route/Get_banks"));
  app.use("/transfer", require("./Route/Transfer"));
});
