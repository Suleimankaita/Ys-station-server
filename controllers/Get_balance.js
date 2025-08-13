const asynchandler=require("express-async-handler");
const User=require('../model/Rg')

const Get_balance=asynchandler(async(req,res)=>{

    try{
        const {id}=req.query;
        if(!id) return res.status(400).json({'message':'UserID not found'});
        const found=await  User.findOne({_id:id}).exec()
        if(!found) return res.status(400).json({'message':`wallet balance not found`});
        const merge=found.wallet.reduce((sum,prv)=>sum+prv,0)
        res.status(201).json(merge)

    }catch(err){
        res.status(400).json({"message":err.message})
    }

})

module.exports=Get_balance