const express=require("express");
const router=express();
const Profile=require('../controllers/Profile')

    router.route('/')
    .post(Profile);

    module.exports=router