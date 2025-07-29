const express=require('express')
const app=express()
// const {test}=require("../controllers/Registration")
const {buy_airtime}=require("../controllers/Buy_airtime")

app.route('/')
.post(buy_airtime)

module.exports=app
