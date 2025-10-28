require("dotenv").config();
const express = require("express");
const app = express();
const Port = process.env.PORT || 4000;
const { Server } = require("socket.io");
const Multer = require("multer");
const Path = require("path");
const fs = require("fs");
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
const request_id = require("./controllers/RequesID");

connect();

// ---- Utility: Get IPv4 addresses ----
function getIPv4() {
  const networkInterfaces = os.networkInterfaces();
  let ipv4s = [];

  Object.keys(networkInterfaces).forEach((ifname) => {
    networkInterfaces[ifname].forEach((iface) => {
      if (iface.family === "IPv4" && !iface.internal) {
        ipv4s.push(iface.address);
      }
    });
  });

  return ipv4s;
}

console.log("IPv4 addresses:", getIPv4());
console.log(os.type(), os.hostname(), os.version(), os.availableParallelism());

// ---- Middleware ----
app.use(cors(opt));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(Path.join(__dirname, "..", "public")));

// ---- Multer setup ----
const storage = Multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Path.join(__dirname, "..", "Public", "img"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + Path.extname(file.originalname));
  },
});
const upload = Multer({ storage });

// ---- Paystack Webhook (Raw Body Required) ----
app.post(
  "/paystack/webhook",
  bodyParser.raw({ type: "*/*" }), // important! raw for signature verification
  asyncHandler(async (req, res) => {
    try {
      const secret = process.env.PAYSTACK_KEY;

      // Verify Paystack signature
      const hash = crypto
        .createHmac("sha512", secret)
        .update(req.body) // raw buffer
        .digest("hex");

      if (hash !== req.headers["x-paystack-signature"]) {
        console.log("❌ Invalid Paystack signature");
        return res.status(400).json({ message: "Invalid signature" });
      }

      // Convert raw buffer to JSON
      const event = JSON.parse(req.body.toString());

      console.log("🔥 Paystack Event:", event.event);
      console.log("📦 Event Data:", event.data);

      // Handle transfer success event
      if (event.event === "transfer.success") {
        const { amount, recipient, reference } = event.data;
        const account_no = recipient?.metadata?.account_no;

        if (!account_no) {
          console.log("⚠️ No account number found in metadata");
          return res.sendStatus(200);
        }

        const creditAmount = amount / 100;
        const user = await User.findOne({ account_no });

        if (!user) {
          console.log("⚠️ User not found for account", account_no);
          return res.sendStatus(200);
        }

        if (!user.wallet || user.wallet.length === 0) user.wallet = [0];
        user.wallet[0] += creditAmount;

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

        console.log(`✅ Wallet credited ₦${creditAmount} for ${user.account_name}`);
      }

      res.sendStatus(200);
    } catch (err) {
      console.error("Webhook Error:", err);
      res.sendStatus(500);
    }
  })
);

// ---- Use express.json() for all other routes ----
app.use(express.json());

// ---- Socket.io + Mongo Connection ----
mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");

  const server = app.listen(Port, () => {
    console.log("Server running on port " + Port);
  });

  const io = new Server(server, {
    cors: { origin: ["*"] },
  });

  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // ---- Other routes ----
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
