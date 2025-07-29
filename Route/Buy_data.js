const express=require("express");
const router=express();
const buy_data=require('../controllers/Buy_data')

    router.route('/')
    .post(buy_data);

    module.exports=router