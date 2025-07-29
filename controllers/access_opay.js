const Axios = require("axios");

const get = async (req, res) => {
  const clientId = "281825061709267";
  const clientSecret = "OPAYPUB17501974537620.9176997467996377";

  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await Axios.post(
      "/api/v2/virtual/account/label/create",
      {
        grantType: "client_credentials" // ✅ This is the request body
      },
      {
        headers: {
          Authorization: `Basic ${encoded}`,
          "Content-Type": "application/json",
        },
      }
    );

    const accessToken = response.data.data.accessToken;
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Token error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get OPay access token" });
  }
};

module.exports = get;
