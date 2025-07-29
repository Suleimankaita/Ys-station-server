require("dotenv").config()
const express=require("express");
const app=express();
const Port=process.env.PORT||4000;
const {Server}=require("socket.io");
const Multer=require("multer");
const Path=require("path");
const fs=require("fs")
const cors=require('cors')
const cookie_perser=require('cookie-parser');
const connect=require("./Config/connection");
const opt=require("./Config/cors");
const os=require('os')
const mongoose=require('mongoose'); 
const request_id=require("./controllers/RequesID")
console.log(os.type(),os.hostname(),os.version(),os.availableParallelism())

connect();
console.log(request_id())

app.use(cors(opt))

app.use(express.json());

app.use(cookie_perser());

app.use(express.urlencoded({extended:false}));

app.use(express.static(Path.join(__dirname,'..','public')))

const storage=Multer.diskStorage({
    destination:(req,files,cb)=>{
        cb(null,Path.join(__dirname,'..','Public','img'))
    },
    filename:(req,files,cb)=>{
        cb(null,Date.now()+Path.join(files.filename))
    }

});

    const upload=Multer({storage:storage});

    mongoose.connection.once('open',()=>{

            console.log("connected to mongodDB")
        
        const server=app.listen(Port,()=>{
            console.log("running on " +Port)
        })
            const io=new Server(server,{
        cors:{origin:['']}
    })

    app.use((req,res,next)=>{
        req.io=io;
        next()
    })
  


    // app.use("/",require('./Route/root'))
    
    app.use("/Regs",require('./Route/User_con'))
    app.use("/Auth",require('./Route/Auth'))
    app.use("/Getbank",require('./Route/GetBanks'))
    app.use("/opay",require('./Route/get_acc'))
    app.use("/test",require('./Route/test'))
    app.use("/Buy_data",require('./Route/Buy_data'))
    app.use("/Verify_smt_tv",require('./Route/verify_smt_tv'))
    app.use("/verify_meter",require('./Route/verify_meter'))
    app.use("/TV_sub",require('./Route/Tv_sub'))
    app.use("/Buy_elec",require('./Route/Buy_elec'))
    app.use("/jamb_verify",require('./Route/Jamb_verify'))
    app.use("/jamb_buy",require('./Route/jamb_buy'))
    app.use("/Weac",require('./Route/Waec'))
    
    }
)
