const asynchandler=require("express-async-handler");
const User=require('../model/Rg')

const add_wallet=asynchandler(async(req,res)=>{

    try{

        const {id,amount}=req.body;

        if(!id) return res.status(400).json({'message':'UserID not found'});
        console.log(amount)
        const found=await User.findOne({_id:id}).exec()
        if(!found) return res.status(400).json({'message':`wallet balance not found`});
        
        const adds=found.wallet.push(Number(amount));
        found.transaction.push({
            product_name:"Ys station wallet",
            amount:Number(amount),
            status:"delivered",
            seen:false,
            date:new Date().toISOString().split("T")[0]
        })

        console.log(adds)
         found.save()

        res.status(201).json({'message':amount})

    }catch(err){
        res.status(400).json({"message":err.message})
    }

})

module.exports=add_wallet