const express=require("express");
const router=express();
const Get_balance=require('../controllers/Get_balance')

    router.route('/')

    .get(Get_balance);

    module.exports=router