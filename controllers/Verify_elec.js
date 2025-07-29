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