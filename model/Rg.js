const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true
  },
  lastname: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    trim: true
  },
  password: {
    type: String
  },
  transaction_pin: {
    type: String
  },
  Phone_no: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  birth: {
    type: String
  },
  gender: {
    type: String
  },
  transaction: [
    {
      from: { type: String },
      to: { type: String },
      status: { type: String },
      product_name: { type: String },
      amount: { type: Number },
      phone: { type: Number },
      commision: { type: Number },
      type: { type: String },
      billercode: { type: String },
      date:{type:String},
      refrenceId:{
        type:String,
        required:true
      },
      meter_token:{
        type:String
      },
      weac_token:[{
        Serial:{type:String},
        Pin:{type:String}
      }]
    }
  ],
  roles: {
    type: String,
    default: 'user'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);

