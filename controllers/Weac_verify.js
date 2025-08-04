const asynchandler=require("express-async-handler");
const axios=require("axios")
const reqs=require("./RequesID")
const User=require("../model/Rg")
const Waec=asynchandler(async(req,res)=>{
    try{
        const {serviceID,billersCode,type,amount,phone,variation_code}=req.body;
        
        const data={
           request_id:reqs(),
            serviceID,type,amount,phone,variation_code
        }

        const response=await axios.post('https://sandbox.vtpass.com/api/pay',data,{
            headers:{
                 'api-key': process.env.VTAPI_KEY,
                "secret-key": process.env.VTSEC_KEY, 
                'Content-Type':'application/json'
            }
        }) 

        if(response.data){
            const arr=[]

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
                    weac_token:response.data.cards.map((ress)=>ress),
                            type:post.data?.content?.transactions?.type,

                }
            }
        })
        
        found.transaction.map(ress=>{
            console.log(ress)
            // res.cards.map(ses=>{})
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