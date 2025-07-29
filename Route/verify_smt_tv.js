const express=require("express");
const router=express();
const Buy_tv=require('../controllers/Verify_smt_tv')

    router.route('/')
    .post(Buy_tv);

    module.exports=router