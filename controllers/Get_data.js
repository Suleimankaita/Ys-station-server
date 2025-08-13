const asyncHandler=require("express-async-handler");
const axios=require('axios')
const getData=asyncHandler(async(req,res)=>{

    try{
        const {serviceID}=req.body;

        const response=await axios.get(`https://vtpass.com/api/service-variations?serviceID=${serviceID}`);

        console.log(response.data)

        
        res.status(201).json(response.data)


      

    }catch{
        res.status(400).json({'message':err.message})
    }

})
module.exports=getData;