const express=require('express');
const route=express()
const Login=require('../controllers/Auth')
const refresh=require('../controllers/refresh')
const Logout=require('../controllers/LogOut');

route.route('/refresh')
.get(refresh)       
route.route('/Login')
.post(Login);

route.route('/Logout')
.post(Logout)


module.exports=route