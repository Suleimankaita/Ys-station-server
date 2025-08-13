const express=require("express");
const router=express();
const getdata=require('../controllers/Get_data')

    router.route('/:id')
    .get(getdata);

    module.exports=router