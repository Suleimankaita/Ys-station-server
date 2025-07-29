const express=require("express");
const router=express();
const Buy_elec=require('../controllers/Buy_elec')

    router.route('/')
    .post(Buy_elec);

    module.exports=router