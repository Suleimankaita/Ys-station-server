const asynchandler=require("express-async-handler");
const axios=require("axios")

const verify_meter_no=asynchandler(async(req,res)=>{
    try{
        const {serviceID,billersCode,type}=req.body;
        
        const data={
            serviceID,
            billersCode,
            type
        }

        const response=await axios.post(' https://sandbox.vtpass.com/api/merchant-verify',data,{
            headers:{
                'api-key': process.env.VTAPI_KEY,
                "secret-key": process.env.VTSEC_KEY, 
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