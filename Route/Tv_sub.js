const express=require("express");
const router=express();
const Tv    =require('../controllers/TV_sub')

    router.route('/')
    .post(Tv);

    module.exports=router