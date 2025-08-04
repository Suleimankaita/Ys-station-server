const asynchandler=require("express-async-handler");
const axios=require("axios");
const reqs=require("./RequesID")
const User=require("../model/Rg")
const buy_tv=asynchandler(async(req,res)=>{

    try{
        const {serviceID,amount,phone,quantity,subscription_type,variation_code,billersCode}=req.body
        const data={
            request_id:reqs(),
            serviceID,
            amount,
            phone:Number(phone),
            billersCode:Number(billersCode),
            variation_code,
            quantity,
            subscription_type
        }

        const post =await axios.post('https://sandbox.vtpass.com/api/pay',data,{
            headers:{
                'Content-Type':'application/json',
                'api-key': process.env.VTAPI_KEY,
                "secret-key": process.env.VTSEC_KEY, 

            }
        })
        if(post.data){

        const username='suleiman'
          const found=await User.findByIdAndUpdate("686c3d0d1c26355eb87bae5e",{
                    '$push':{
                        transaction:{
                            from:username,
                            status:post.data?.content?.transactions?.status,
                            product_name:post.data?.content.transactions?.product_name,
                            commision:post?.data?.content?.transactions?.commision,
                            date: new Date().toLocaleDateString().split("T")[0],
                            phone:post.data?.content?.transactions?.phone,
                            type:post.data?.content?.transactions?.type,
                            amount:Number(amount),
                            refrenceId:reqs()
                        }
                    }
                })
                
                console.log(found)
        console.log(post.data)
        res.status(201).json({"message":post.data})
        }

    }catch(err){
        console.log(err)
        res.status(400).json({"message":err.message})
    }

})
module.exports=buy_tv;