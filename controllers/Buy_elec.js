const asynchandler=require("express-async-handler");
const axios=require("axios");
const reqs=require('./RequesID')
const Buy_tv= asynchandler(async(req,res)=>{
    try{

        const {serviceID,variation_code,billersCode,amount,phone}=req.body
        
        const data={
            serviceID,
            variation_code,
            billersCode,
            amount,
            phone,
            request_id:reqs()
        }

        const response=await axios.post("https://sandbox.vtpass.com/api/pay",data,{
            headers:{
                "Content-Type":"application/json",
                'api-key':'9e2febd28928c3a1c47e92b7fd7f10e5',
                "secret-key":"SK_68201794f3f530f9e72d6dbc5a9e5f6197a8342916f", 
            }
        })
        console.log(response.data)
        res.status(201).json({"message":response.data})
    }catch(err){
        console.log(err)
        res.status(400).json({"message":err})

    }
})

module.exports=Buy_tv;