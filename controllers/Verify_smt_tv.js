const asynchandler=require("express-async-handler");
const axios =require('axios')
const buy_tv=asynchandler(asynchandler(async(req,res)=>{

    try{
        const {serviceID,billersCode}=req.body;
        const data={
            serviceID,
            billersCode
        }
        const post =await axios.post("https://sandbox.vtpass.com/api/merchant-verify",data,{
            headers:{
                Authorization:`Basic ${btoa(`suleiman20015kaita@gmail.com:mansmnyu9`)}`,
                'Content-Type':'application/json'
            }
        })
            console.log(post.data)
            res.status(201).json({"message":post.data})
    }catch(err){
        res.status(400).json({"message":err.message})
        console.log(err)
    }
    
}))

module.exports=buy_tv