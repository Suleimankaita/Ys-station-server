const jwt=require('jsonwebtoken');
const asynchandler=require("express-async-handler");
const User_reg =require("../model/Rg")

const Logout=asynchandler((req,res)=>{
    const cookies=req?.cookies
    if(!cookies){
        return res.status(401).json({"message":"UnAuthorized"})
    }

    res.clearCookie('jwt',{httpOnly:true,sameSite:'none',secure:true})

})
module.exports=Logout