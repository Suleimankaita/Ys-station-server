const express=require("express");
const router=express();
const Weac=require('../controllers/Weac_verify')

    router.route('/')
    .post(Weac);

    module.exports=router