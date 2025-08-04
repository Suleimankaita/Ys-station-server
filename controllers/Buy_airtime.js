const asynchandler = require("express-async-handler");
const axios = require("axios");
const reqs = require('./RequesID');
const User = require("../model/Rg");

const buy_airtime = asynchandler(async (req, res) => {
    const { serviceID, amount, phone, id } = req.body;
    
    if (!serviceID || !amount || !phone) {
        return res.status(400).json({ message: "Missing required fields: serviceID, amount, phone" });
    }

    try {
        const data = {
            request_id: reqs(),
            serviceID,
            amount,
            phone
        };

        const response = await axios.post('https://sandbox.vtpass.com/api/pay', data, {
            headers: {
                'api-key': process.env.VTAPI_KEY,
                "secret-key": process.env.VTSEC_KEY,
                "Content-Type": "application/json"
            }
        });

        if (response.data) {
            // Update user with transaction details
            const updatedUser = await User.findByIdAndUpdate(
                id || "686c3d0d1c26355eb87bae5e", // Use provided ID or fallback to default
                {
                    $push: {
                        transaction: {
                            phone: phone,
                            amount: amount,
                            status: response?.data?.content?.transactions?.status,
                            type: response?.data?.content?.transactions?.type,
                            product_name: response?.data?.content?.transactions?.product_name,
                            commission: Number(response?.data?.content?.transactions?.commission) || 0,
                            billersCode: Number(response?.data?.content?.transactions?.billersCode),
                            date: new Date().toLocaleDateString().split("T")[0],
                            refrenceId:reqs()
                        }
                    }
                },
                { new: true }
            ).exec();

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(201).json({
                message: "Transaction successful",
                data: response.data,
                user: updatedUser
            });
        }
    } catch (err) {
        console.error("Error in buy_airtime:", err);
        
        // Handle axios errors specifically
        const errorMessage = err.response?.data?.message || err.message;
        
        return res.status(err.response?.status || 500).json({
            message: "Transaction failed",
            error: errorMessage
        });
    }
});

module.exports = { buy_airtime };