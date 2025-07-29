const jwt=require('jsonwebtoken')
const User=require("../model/Rg")
const asynchandler=require("express-async-handler")

const verify=asynchandler(async(req,res,next)=>{
    const auth=req.headers.authorization||req.headers.Authorization
    if(!auth?.startsWith("Bearer ")) return res.status(403).json({"message":"Unable to refresh app"});

    const token=auth.split(" ")[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async(err,decode)=>{
            if(err) return res.status(401).json({"message":"verification fail"});

            const found =await User.find({username:decode.UserInfo.username});

            if(!found) return res.status(401).json({"message":"Unathorized"});

            if(!found?.active) return res.status(403).json({"mesage":`this account has been suspendent ${decode.UserInfo.username}`})

                req.username=decode.UserInfo.username;
                req.password=decode.UserInfo.password;
                next()
        }
    )

})

module.exports=verify;