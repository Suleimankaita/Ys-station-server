const express=require("express");
const router=express();
const Jamb_purchase=require('../controllers/Jamb_purchase')

    router.route('/')
    .post(Jamb_purchase);

    module.exports=router