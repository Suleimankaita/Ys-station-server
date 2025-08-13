const asynchandler = require("express-async-handler");
const axios = require("axios");
const reqs = require('./RequesID');
const User = require("../model/Rg");

const buy_airtime = asynchandler(async (req, res) => {
    
    try {
        const { serviceID, amount, phone, id } = req.body;
        
        console.log(amount,phone)
        if (!serviceID || !amount || !phone||!id) {
            console.log(id)
            return res.status(400).json({ message: "Missing required fields: serviceID, amount, phone" });
        }
        const data = {
            request_id: reqs(),
            serviceID,
            amount,
            phone
        };

        const wallets=await User.findOne({_id:id}).exec()

        const reducess=wallets.wallet.reduce((sum,prv)=>sum+prv,0)

        if(reducess<=Number(amount)) return res.status(400).json({'message':'Insufficient founds'}) 
        const response = await axios.post('https://vtpass.com/api/pay', data, {
            headers: {
               'api-key': "a17489439ab7831a9d19f3f30bc44283",
                "secret-key":"SK_8687428c85603336aa302d46b0ff49402630b9626ce", 
                "Content-Type": "application/json"
            }
        });

        if (response.data?.content?.transactions?.status==="delivered") {
            const updatedUser = await User.findByIdAndUpdate(id,
                {
                    $push: {
                        wallet:Number(-amount),
                        transaction: {
                            phone: phone,
                            amount: Number(-amount),
                            status: response?.data?.content?.transactions?.status,
                            type: response?.data?.content?.transactions?.type,
                            product_name: response?.data?.content?.transactions?.product_name,
                            commission: Number(response?.data?.content?.transactions?.commission) || 0,
                            billersCode: Number(response?.data?.content?.transactions?.billersCode),
                            seen:false,
                            date: new Date().toISOString().split('T')[0],
                            refrenceId:reqs()
                        }
                    }
                },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

        }else{
            const updatedUser = await User.findByIdAndUpdate(
                id, 
                {
                    $push: {
                        transaction: {
                            phone: phone,
                            amount: Number(-amount),
                            status: response?.data?.content?.transactions?.status,
                            type: response?.data?.content?.transactions?.type,
                            product_name: response?.data?.content?.transactions?.product_name,
                            commission: Number(response?.data?.content?.transactions?.commission) || 0,
                            seen:false,

                            billersCode: Number(response?.data?.content?.transactions?.billersCode),
                            date: new Date().toISOString().split('T')[0],
                            refrenceId:reqs()
                        }
                    }
                },
                { new: true }
            );
            console.log(updatedUser)

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
        }
        if(response.data.response_description==="LOW WALLET BALANCE"){
            const admins=await User.findOne({'roles':"Admin"}).exec()
            if(!admins){
                return res.status(401).json({'message':'contact this number for customer care 08134518265'})
            }
            return res.status(201).json({'message':response.data.response_description})

        }
        res.status(201).json(response.data);
    } catch (err) {
        console.error("Error in buy_airtime:", err);
        
        const errorMessage = err.response?.data?.message || err.message;
        
        return res.status(err.response?.status || 500).json({
            message: "Transaction failed",
            error: errorMessage
        });
    }
});

module.exports = { buy_airtime };