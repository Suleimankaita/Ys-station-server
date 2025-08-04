const express=require('express')
const route=express.Router();
const verify=require('../middleware/Verrify')
const Getallusers=require('../controllers/GetUser')
route.route('/')
.get(verify,Getallusers)

module.exports=route