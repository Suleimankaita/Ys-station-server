const asynchandler=require("express-async-handler")
const {Buffer}=require('buffer')
const axios = require("axios");
const reqs=require('./RequesID')
const buy_airtime=asynchandler(async(req,res)=>{
    
    const {serviceID,amount,phone}=req.body;
    console.log(req.body)
    try{

    const data = {
    "request_id":reqs(),
    serviceID: "mtn",
    serviceID ,              // Use "mtn", "glo", "etisalat", or "airtel"
    amount,
    phone
};

    const response=await axios.post('https://vtpass.com/api/pay',data,{
        headers:{
    "api-key": "a17489439ab7831a9d19f3f30bc44283", // Your static API key
    "secret-key":"SK_8431c7f71e479a2ba11683e17c4f252cc90de46bd61", // Your generated secret key
    "Content-Type": "application/json"
        }
    })
    res.status(201).json({'message':response.data})
    if(response.data){
        console.log(response.data)
    }

    }catch(err){
        console.log(err)
        res.status(400).json({'message':err.message})
    }
    
})

// 

module.exports={buy_airtime}