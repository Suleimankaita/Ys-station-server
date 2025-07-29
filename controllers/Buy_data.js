const asynchandler=require("express-async-handler");
const axios=require("axios");
const reqs=require("./RequesID")
const buy_data=asynchandler(async(req,res)=>{

    try{
        const {serviceID,amount,phone,variation_code}=req.body
        console.log(variation_code)
        const data={
            request_id:reqs(),
            serviceID,
            amount,
            phone:Number(phone),
            variation_code

        }

        const post =await axios.post('https://sandbox.vtpass.com/api/pay',data,{
            headers:{
                'Content-Type':'application/json',
                'api-key':'9e2febd28928c3a1c47e92b7fd7f10e5',
    "secret-key":"SK_68201794f3f530f9e72d6dbc5a9e5f6197a8342916f", 

            }
        })
        console.log(post.data)
        res.status(201).json({"message":post.data})
    }catch(err){
        console.log(err)
        res.status(400).json({"message":err.message})
    }

})
module.exports=buy_data;