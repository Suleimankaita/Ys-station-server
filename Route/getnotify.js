const express=require('express')
const route=express.Router();
const verify=require('../middleware/Verrify')
const getnotify=require('../controllers/get_notify')
route.route('/')
.get(getnotify)

module.exports=route