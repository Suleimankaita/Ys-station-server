const express=require("express");
const router=express();
const Add_wallet=require('../controllers/Add_wallet')

    router.route('/')
    .post(Add_wallet);

    module.exports=router