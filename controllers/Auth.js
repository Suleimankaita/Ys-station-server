const jwt=require('jsonwebtoken');
const asynchandler=require("express-async-handler");
const User_reg =require("../model/Rg")
const nodemailer=require('nodemailer')
const os=require('os')
const Login=asynchandler(async(req,res)=>{

    const {username,password}=req.body;
    console.log(req.body)
    if(!username||!password){
        return res.status(400).json({'message':'all are required'})
    }

    console.log(req.headers['user-agent'])

    const found=await User_reg.findOne({username}).exec()

    if(!found){
        return res.status(401).json({'message':'Incorrect username or password '})
    }

    if(found.username===username&&found.password===password){
        console.log(found.id) 
               const acccestoken=jwt.sign(
            {'UserInfo':{
                'Username':found.username,
                'password':found.password,
                'role':found.roles,
                'id':found.id,
                "account_name":found.account_name,
                "account_no":found.account_no,
            }},
           
            process.env.ACCESS_TOKEN_SECRET,
            
            {expiresIn:'20m'}
        )
        const refrshtoken=jwt.sign(
            {'UserInfo':{
                'Username':found.username,
                'password':found.password,
                'role':found.roles,
                "account_no":found.account_no,
                "account_name":found.account_name,
                'id':found.id,
            }},
           
            process.env.REFRESH_TOKEN_SECRET,
            
            {expiresIn:'7d'}
        )
        
                res.cookie('jwt',refrshtoken,{httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'None', 
                maxAge: 7 * 24 * 60 * 60 * 1000 })
        
        
            console.log(`${found.username} is logged in`)
                res.status(201).json({acccestoken})
    }else{
 console.log('incorrect username or password')
        return res.status(401).json({'message':'Incorrect username or password'})
       
}

}
)

module.exports=Login