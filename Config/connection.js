const moongose=require('mongoose');
const asynchandler=require('express-async-handler');

const connection=asynchandler(async()=>{

    await moongose.connect(process.env.DATA_URI)
    
})

module.exports=connection