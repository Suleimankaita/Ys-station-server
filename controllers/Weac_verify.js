const asynchandler=require("express-async-handler");
const axios=require("axios")
const reqs=require("./RequesID")
const User=require("../model/Rg")
const Waec=asynchandler(async(req,res)=>{
    try{
        const {serviceID,billersCode,type,amount,phone,variation_code,id}=req.body;
        
        const data={
           request_id:reqs(),
            serviceID,type,amount,phone,variation_code
        }
 const wallets=await User.findOne({_id:id}).exec()

        const reducess=wallets.wallet.reduce((sum,prv)=>sum+prv,0)
        if(reducess<=Number(amount)) return res.status(400).json({'message':'Insufficient founds'}) 
        const response=await axios.post('https://sandbox.vtpass.com/api/pay',data,{
            headers:{
                 'api-key': process.env.VTAPI_KEY,
                "secret-key": process.env.VTSEC_KEY, 
                'Content-Type':'application/json'
            }
        }) 

        if(response.data?.content?.transactions?.status==="delivered"){
            const arr=[]

                const found=await User.findByIdAndUpdate(id,{
            '$push':{
                wallet:Number(-amount),
                transaction:{
                    from:"suleiman",
                    status:response.data?.content?.transactions?.status,
                    product_name:response.data?.content.transactions?.product_name,
                    commision:response?.data?.content?.transactions?.commision,
                            date: new Date().toISOString().split('T')[0],
                    phone:response.data?.content?.transactions?.phone,
                    amount:Number(amount),
                            seen:false,

                    refrenceId:reqs(),
                    meter_token:response.data?.Token,
                    weac_token:response.data.cards.map((ress)=>ress),
                            type:post.data?.content?.transactions?.type,

                }
            }
        })
         if(response.data.response_description==="LOW WALLET BALANCE"){
                    const admins=await User.findOne({'roles':"Admin"}).exec()
                    if(!admins){
                        return res.status(401).json({'message':'contact this number for customer care 08134518265'})
                    }
                    return res.status(201).json({'message':response.data.response_description})
        
                }
                 
        }else{
  const found=await User.findByIdAndUpdate(id,{
            '$push':{
                transaction:{
                    from:"suleiman",
                    status:response.data?.content?.transactions?.status,
                    product_name:response.data?.content.transactions?.product_name,
                    commision:response?.data?.content?.transactions?.commision,
                            date: new Date().toISOString().split('T')[0],
                    phone:response.data?.content?.transactions?.phone,
                    amount:Number(amount),
                    refrenceId:reqs(),
                    meter_token:response.data?.Token,
                    weac_token:response.data.cards.map((ress)=>ress),
                            seen:false,

                            type:post.data?.content?.transactions?.type,

                }
            }
        })
        }

        // console.log(response.data)
        res.status(201).json({"message":response.data})
    }catch(err){
        res.status(400).json({"message":err})
        console.log(err)

    }
})

module.exports=Waec