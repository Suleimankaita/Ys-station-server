const asynchandler=require('express-async-handler');
const User=require('../model/Rg')
const profile=asynchandler(async(req,res)=>{
    try{

        const {id}=req.body;
        const img=req.file;

        if(!id||!img) return console.log({'message':'u most change the img'})

            const found=await User.findByIdAndUpdate({_id:id},{
                img:img.filename
            })
            console.log(found)

            if(!found)console.log('user not found')

            res.status(201).json({'message':'new img added'})

    }catch(err){
        res.status(400).json({'message':err.message})
    }
})

module.exports=profile;