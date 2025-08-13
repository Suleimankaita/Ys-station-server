const asynchandler=require("express-async-handler");
const axios=require("axios");
const reqs=require("./RequesID")
const User=require("../model/Rg")
const buy_tv=asynchandler(async(req,res)=>{

    try{
        const {serviceID,amount,phone,quantity,subscription_type,variation_code,billersCode,id}=req.body
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
 const wallets=await User.findOne({_id:id}).exec()

        const reducess=wallets.wallet.reduce((sum,prv)=>sum+prv,0)
        if(reducess<=Number(amount)) return res.status(400).json({'message':'Insufficient founds'}) 
        const post =await axios.post('https://sandbox.vtpass.com/api/pay',data,{
            headers:{
                'Content-Type':'application/json',
                'api-key': process.env.VTAPI_KEY,
                "secret-key": process.env.VTSEC_KEY, 

            }
        })
        if(post.data?.content?.transactions?.status==="delivered"){

        const username='suleiman'
          const found=await User.findByIdAndUpdate(id,{
                    '$push':{
                wallet:Number(-amount),

                        transaction:{
                            from:username,
                            status:post.data?.content?.transactions?.status,
                            product_name:post.data?.content.transactions?.product_name,
                            commision:post?.data?.content?.transactions?.commision,
                            date: new Date().toISOString().split('T')[0],
                            seen:false,
                            phone:post.data?.content?.transactions?.phone,
                            type:post.data?.content?.transactions?.type,
                            amount:Number(amount),
                            refrenceId:reqs()
                        }
                    }
                })
                
                  if(post.data.response_description==="LOW WALLET BALANCE"){
                                        const admins=await User.findOne({'roles':"Admin"}).exec()
                                        if(!admins){
                                            return res.status(401).json({'message':'contact this number for customer care 08134518265'})
                                        }
                                        return res.status(201).json({'message':post.data.response_description})
                            
                                    }
                            
                                }else{
                                   const found=await User.findByIdAndUpdate(id,{
                    '$push':{
                        transaction:{
                            from:username,
                            status:post.data?.content?.transactions?.status,
                            product_name:post.data?.content.transactions?.product_name,
                            commision:post?.data?.content?.transactions?.commision,
                            date: new Date().toISOString().split('T')[0],
                            phone:post.data?.content?.transactions?.phone,
                            seen:false,
                            type:post.data?.content?.transactions?.type,
                            amount:Number(amount),
                            refrenceId:reqs()
                        }
                    }
                })
           
                                }
                                res.status(201).json({"message":post.data})

    }catch(err){
        console.log(err)
        res.status(400).json({"message":err.message})
    }

})
module.exports=buy_tv;