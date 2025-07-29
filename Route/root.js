const expreess=require("express");
const router=expreess()

const path=require("path")


router.route('index.html',(req,res)=>{
    res.sendFile(path.join(__dirname ,'../Public/views/index.html'))
    console.log(req.url)
})

module.exports=router