
const fs=require('fs')
const expressAsyncHandler = require("express-async-handler");

const clientId = '281825061709267';
const clientSecret = "OPAYPRV17501974537620.1970680893220086";
const merchantId = '281825061709267';
// const privateKey = fs.readFileSync('private-key.pem', 'utf8');
   
const Opays=expressAsyncHandler(async (req, res) => {
  const timestamp = Date.now();
  const signString = `${clientId}${clientSecret}${merchantId}${timestamp}`;

  const signature = crypto
    .createSign('RSA-SHA512')
    .update(signString)
    .sign(privateKey, 'base64');

  const tokenPayload = {
    clientId,
    clientSecret,
    merchantId,
    timestamp,
    signature
  };

  const tokenRes = await fetch('https://sandboxapi.opaycheckout.com/api/v3/authorizations/access-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokenPayload)
  });

  const tokenJson = await tokenRes.json();
  res.json(tokenJson);
});

module.exports=Opays