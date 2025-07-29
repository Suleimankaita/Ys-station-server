const asynchandler=require("express-async-handler");
const axios=require("axios")
const reqs=require("./RequesID")
const verify_meter_no=asynchandler(async(req,res)=>{
    try{
        const {serviceID,billersCode,variation_code,phone,amount}=req.body;
        
        const data={
            serviceID,
            billersCode:Number(billersCode),
            variation_code,
            amount,
            phone:Number(phone),
            request_id:reqs()
        }

        const response=await axios.post(' https://sandbox.vtpass.com/api/pay',data,{
            headers:{
                 'api-key':'9e2febd28928c3a1c47e92b7fd7f10e5',
    "secret-key":"SK_68201794f3f530f9e72d6dbc5a9e5f6197a8342916f", 
                'Content-Type':'application/json'
            }
        }) 
        console.log(response.data)
        res.status(201).json({"message":response.data})
    }catch(err){
        res.status(400).json({"message":err})
        console.log(err)

    }
})

module.exports=verify_meter_no