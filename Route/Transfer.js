const express=require("express");
const router=express();
const transfer=require('../controllers/Tranfer_tobank')

    router.route('/')
    .post(transfer);

    module.exports=router