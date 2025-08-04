const asynchandler = require("express-async-handler");
const axios = require('axios');

const verify_smt = asynchandler(async (req, res) => {
    try {
        const { serviceID, billersCode } = req.body;

        const data = {
            serviceID,
            billersCode
        };

        const auth = Buffer.from(`Suleiman20015kaita@gmail.com:@Mansmnyu9`).toString('base64');

        const post = await axios.post(
            "https://vtpass.com/api/merchant-verify",
            data,
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(post.data);
        res.status(201).json({ message: post.data });

    } catch (err) {
        console.error(err.message);
        res.status(400).json({ message: err.message });
    }
});

module.exports = verify_smt;
