const jwt=require('jsonwebtoken');
const asynchandler=require("express-async-handler");
const User_reg =require("../model/Rg")

const refresh=async(req,res)=>{
    const cookies=req?.cookies?.jwt
    console.log(req.cookies)
    if(!cookies){
        return res.status(401).json({"message":"UnAuthorized"})
    }



        jwt.verify(
            cookies,
            process.env.REFRESH_TOKEN_SECRET,
            asynchandler(async(err,decode)=>{
        
                if(err){
                    res.status(401).json({'message':'refresh errors'})
                }
        //         const found =await User_reg.findOne({username:decode?.UserInfo.username}).exec()

        // if(!found) return res.status(401).json({'message':'user not found'})

        //     if(!found?.active)return res.status(400).json({'message':`${found.username} Suspendend`})
           
                
                const acccestoken=jwt.sign(
                    {'UserInfo':{
                'Username':decode?.username,
                'password':decode?.password,
                'role':decode?.roles,
                'id':decode?.id
            }},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'10m'}
        ) 
   
        res.status(201).json(acccestoken)
    }


        )
    )
}

module.exports=refresh