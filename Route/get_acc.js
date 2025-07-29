const opay=require('../controllers/access_opay');
const express=require('express')
const app=express()

app.route('/')
.get(opay)

module.exports=app
