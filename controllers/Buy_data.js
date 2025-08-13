const asynchandler=require("express-async-handler");
const axios=require("axios");
const User=require('../model/Rg')
const reqs=require("./RequesID")
const buy_data=asynchandler(async(req,res)=>{

    try{
        const {serviceID,amount,phone,variation_code,username,id}=req.body
        console.log(variation_code,amount,phone)
        const data={
            request_id:reqs(),
            serviceID,
            amount,
            phone:Number(phone),
            variation_code

        }
         const wallets=await User.findOne({_id:id}).exec()
        
                const reducess=wallets.wallet.reduce((sum,prv)=>sum+prv,0)
                if(reducess<=Number(amount)) return res.status(400).json({'message':'Insufficient founds'}) 
        const post =await axios.post('https://sandbox.vtpass.com/api/pay',data,{
            headers:{
                'api-key': "9e2febd28928c3a1c47e92b7fd7f10e5",
                "secret-key":"SK_5938bf2ff6d60f45f08a172ee5a5c54d8e503bf6a3d", 
                'Content-Type':'application/json',

            }
        })
        if(post.data?.content?.transactions?.status==="delivered"){
            // console.log(post.data)
            
        const found=await User.findByIdAndUpdate(id,{
            '$push':{
                wallet:Number(-amount),
                transaction:{
                    from:username,
                    status:post.data?.content?.transactions?.status,
                    product_name:post.data?.content.transactions?.product_name,
                    commision:post?.data?.content?.transactions?.commision,
                    type:post.data?.content?.transactions?.type,
                            seen:false,
                            date: new Date().toISOString().split('T')[0],
                    phone:phone,
                    amount:Number(-amount),
                    refrenceId:reqs()
                }
            }
        }
    )
              if(post.data.response_description==="LOW WALLET BALANCE"){
                        const admins=await User.findOne({'roles':"Admin"}).exec()
                        if(!admins){
                            return res.status(401).json({'message':'contact this number for customer care 08134518265'})
                        }
                        return res.status(201).json({'message':post.data.response_description})
            
                    }
            

    console.log(found)
        
    }else{
        const found=await User.findByIdAndUpdate(id,{
            '$push':{
                transaction:{
                    from:username,
                    status:post.data?.content?.transactions?.status,
                    product_name:post.data?.content.transactions?.product_name,
                    commision:post?.data?.content?.transactions?.commision,
                            seen:false,
                    type:post.data?.content?.transactions?.type,
                            date: new Date().toISOString().split('T')[0],
                    phone:phone,
                    amount:Number(-amount),
                    refrenceId:reqs()
                }
            }
        }
    )
            

    console.log(found)
        
}
    res.status(201).json({"message":post.data})
    }catch(err){
        console.log(err)
        res.status(400).json({"message":err.message})
    }

})
module.exports=buy_data;