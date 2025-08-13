const User=require('../model/Rg')
const asyncHandler=require("express-async-handler")

const getalluser=asyncHandler(async(req,res)=>{
    try{
        const data=await User.find().select('-password').exec();
        if(data.length){
            res.status(201).json(data)
        }else{
            res.status(400).json({'message':'empty Userlist'})
        }
    }catch(err){
        res.status(400).json({'message':err.message})
    }
})

module.exports=getalluser