const express=require("express");
const router=express();
const Jamb_verify=require('../controllers/Jamb_verify')

    router.route('/')
    .post(Jamb_verify);

    module.exports=router