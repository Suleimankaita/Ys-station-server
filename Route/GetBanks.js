const opay=require('../controllers/searh_banks');
const express=require('express')
const app=express()

app.route('/')
.get(opay)

module.exports=app
