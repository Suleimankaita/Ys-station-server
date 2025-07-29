const express=require("express");
const router=express();
const verify_elec=require('../controllers/Verify_elec')

    router.route('/')
    .post(verify_elec);

    module.exports=router