const asynchandler=require("express-async-handler");
const axios=require("axios");
const reqs=require('./RequesID')
const User =require("../model/Rg")
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
                 'api-key': process.env.VTAPI_KEY,
                "secret-key": process.env.VTSEC_KEY, 
            }
        })
        if(response.data){
              const found=await User.findByIdAndUpdate("686c3d0d1c26355eb87bae5e",{
            '$push':{
                transaction:{
                    from:"suleiman",
                    status:response.data?.content?.transactions?.status,
                    product_name:response.data?.content.transactions?.product_name,
                    commision:response?.data?.content?.transactions?.commision,
                   date: new Date().toLocaleDateString().split("T")[0],
                    phone:response.data?.content?.transactions?.phone,
                    amount:Number(amount),
                    refrenceId:reqs(),
                    meter_token:response.data?.Token,
                    weac_token:response.data.cards,
                            type:post.data?.content?.transactions?.type,

                }
            }
        })
        
        console.log(found)
        }
        // console.log(response.data)
        res.status(201).json({"message":found})
    }catch(err){
        console.log(err)
        res.status(400).json({"message":err})

    }
})

module.exports=Buy_tv;