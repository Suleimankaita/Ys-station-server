const User=require('../model/Rg')
const asyncHandler=require("express-async-handler")

const getfind=asyncHandler(async(req,res)=>{
    try{
        const {id}=req.query;
        const data=await User.findOne({_id:id}).exec();
        console.log(data.length)
        if(data.length){
            const trs=data.transaction.map(res=>res)
            res.status(201).json({'message':trs})
        }else{
            res.status(400).json({'message':'empty transaction'})
        }
    }catch(err){
        res.status(400).json({'message':err.message})
    }
})

module.exports=getfind