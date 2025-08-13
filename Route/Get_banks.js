const Getbank=require('../controllers/Get_all_banks');
const express=require('express')
const app=express()

app.route('/')
.get(Getbank)

module.exports=app

