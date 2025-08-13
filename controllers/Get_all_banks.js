const axios=require('axios');
const asynchandler=require("express-async-handler")

const get_banks=asynchandler(async(req,res)=>{

    try{

        const response=await axios.get("https://api.paystack.co/bank",{
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer sk_live_8881e5914c026b0962911655cdeb45fc8fb47bd5`,
            }
        })
        
        res.status(201).json(response.data)

    }catch(err){
        res.status(400).json({'message':err.message})
    }

})

module.exports=get_banks;