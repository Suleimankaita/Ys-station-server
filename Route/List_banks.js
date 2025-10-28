const {resolveAccount}=require('../controllers/List_banks');
const express=require('express')
const app=express()

app.route('/')
.post(resolveAccount)

module.exports=app
