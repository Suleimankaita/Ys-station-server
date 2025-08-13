const asynchandler = require("express-async-handler");
const axios = require('axios');

const buy_tv = asynchandler(async (req, res) => {
  try {
    const { serviceID, billersCode } = req.body;

    const data = {
      serviceID,
      billersCode
    };

    const auth = Buffer.from(`suleiman20015kaita@gmail.com:@Mansmnyu9`).toString('base64');

    const post = await axios.post("https://vtpass.com/api/merchant-verify", data, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(post.data);
    res.status(200).json({ message: post.data });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json({ message: err.response?.data || err.message });
  }
});

module.exports = buy_tv;
