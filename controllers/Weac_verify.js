const asynchandler=require("express-async-handler");
const axios=require("axios")
const reqs=require("./RequesID")
const Waec=asynchandler(async(req,res)=>{
    try{
        const {serviceID,billersCode,type,amount,phone,variation_code}=req.body;
        
        const data={
           request_id:reqs(),
            serviceID,type,amount,phone,variation_code
        }

        const response=await axios.post('https://sandbox.vtpass.com/api/pay',data,{
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

module.exports=Waec