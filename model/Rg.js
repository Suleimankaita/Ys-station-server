const mongoose=require('mongoose');

const User_reg=new mongoose.Schema({
    firstname:{
        type:String,
        // required:true,
    },
    lastname:{
        type:String,
        // required:true,
    },
    username:{
        type:String,
        // required:true,
    },
    password:{
        type:String,
        // required:true,
    },
    transaction_pin:{
        type:String,
    },
    Phone_no:{
        type:String,
    },
    active:{
        type:Boolean,
        default:true
    },
        birth:{
        type:String,
        // required:true,
    },
        gender:{
        type:String,
        // required:true,
    },
    transaction:[{
        from:String,
        to:String,
        status:String,
        product_name:String,
        
              
    }],
    roles:{
        type:String,
        default:'user',
    }
}
,{
    timestamps:true
}
)

module.exports=mongoose.model("User",User_reg)