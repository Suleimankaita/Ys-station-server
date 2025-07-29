    const express =require('express');
    const route=express()
    const {Get,Regs,delete_user,edit_user}=require('../controllers/Registration')
    const verify=require('../middleware/Verrify')

    route.route('/')
    .get(verify,Get)
    .post(Regs)
    .delete(delete_user)
    .patch(edit_user)

    module.exports=route