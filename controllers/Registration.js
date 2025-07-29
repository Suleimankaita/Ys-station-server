const path=require("path");
const asynhandle=require('express-async-handler')
const jwt=require("jsonwebtoken");
const User_reg=require('../model/Rg')
const axios=require('axios')
const {Buffer}=require('buffer')

const test = async (req, res) => {
  const data = {
    "request_id": "id-" + Date.now(),
    serviceID: "mtn",               // Use "mtn", "glo", "etisalat", or "airtel"
    billersCode: "09169804387",     // For airtime, this is the phone number
    variation_code: "",             // Leave blank for airtime
    amount: 100,                   // Airtime amount in Naira
    phone:Number("08134518265")            // Receiver's phone
  };

  const headers = {
    "api-key": "9e2febd28928c3a1c47e92b7fd7f10e5", // Your static API key
    "secret-key":"SK_68201794f3f530f9e72d6dbc5a9e5f6197a8342916f", // Your generated secret key
    "Content-Type": "application/json"
  };

  try {
    const response = await axios.post(
      "https://sandbox.vtpass.com/api/pay",
      data,
      { headers }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("VTpass API error:", error.response?.data || error.message);
    res.status(500).json({ error: "VTpass request failed", details: error.response?.data });
  }
};


const Get=asynhandle(async(req,res)=>{
    const data=await User_reg.find().lean().select('-password')
    if(!data.length){
        return res.status(400).json({'message':'Empty user list'})
    }
    res.status(201).json(data)
})

const Regs = asynhandle(async (req, res) => {
  const { firstname, lastname, Phone_no, password, gender, birth, username } = req.body;
  


  if (!firstname || !lastname || !Phone_no || !password || !gender || !birth || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const find_user = await User_reg.findOne({ username }).exec();
  if (find_user) {
    return res.status(409).json({ message: `${username} is already taken` });
  }

  const find_phone = await User_reg.findOne({ Phone_no }).exec();
  if (find_phone) {
    return res.status(409).json({ message: `${Phone_no} is already registered` });
  }

  const userCredit = await User_reg.create({
    firstname,
    lastname,
    Phone_no,
    password,
    gender,
    birth,
    username
  });

  return res.status(201).json(userCredit);

 
    // try{

//     const apikey = process.env.API_KEY;
//     const client_secret = process.env.SECRET_KEY;

//     const basicAuth = Buffer.from(`${apikey}:${client_secret}`).toString('base64');

//   const all ={
//     "contractCode":"7059707855",
//     "accountName":"Jane Doe",
//     "currencyCode":"NGN",
//     "accountReference": "janedoe1223--3",
//     "customerEmail": "janedoe@gmail.com",
//     "customerName": "Jane Doe",
//     "reservedAccountType": "INVOICE",
//     "getAllAvailableBanks":true,
//     "incomeSplitConfig": [
//         {
//             "subAccountCode": "MFY_SUB_322165393053",
//             "feePercentage": 10.5,
//             "splitAmount": 20,
//             "feeBearer": true
//         }
//     ],
//     "metaData": {
//         "ipAddress": "127.0.0.1",
//         "deviceType": "mobile"
//     }
// }
// const posts = await axios.post(
    
//   'https://sandbox.monnify.com/api/v1/auth/login',
// //   all, // your body payload
//   {
//     // headers: {
//     // //   Authorization: `Basic ${basicAuth}`,
//     //   'Content-Type': 'application/json',
//     // },
// );
// console.log(posts)

// https://developers.monnify.com/api/#pay-with-bank-transfer
// }catch(err){
    // console.log(err)
//   return res.status(401).json(err.data);

// }

});

// const Regs = async (req, res) => {
//   try {
//     const apiKey = 'MK_TEST_0Z98M1ZMVE';
//     const secretKey = '9V4VKEUYH4ZUMUVKG9BAR2NZQ1MK5LR5';

//     console.log(apiKey)
//     const basicAuth = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');

//     // Step 1: Authenticate to get access token
//     const authRes = await axios.post(
//       'https://sandbox.monnify.com/api/v1/auth/login',
//       {}, // No body required
//       {
//         headers: {
//           Authorization: `Basic ${basicAuth}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const accessToken = authRes.data.responseBody.accessToken;

//     // Step 2: Now make actual wallet/account request using the token
//     const userCredit = {
//       contractCode: "8834052815",
//       accountName: "Ys data",
//       currencyCode: "NGN",
//       accountReference: "janedoe1223--3",
//       customerEmail: "janedoe@gmail.com",
//       customerName: "Jane Doe",
//       reservedAccountType: "INVOICE",
//       getAllAvailableBanks: true,
//       incomeSplitConfig: [
//         {
//           subAccountCode: "MFY_SUB_322165393053",
//           feePercentage: 10.5,
//           splitAmount: 20,
//           feeBearer: true,
//         },
//       ],
//       metaData: {
//         ipAddress: "127.0.0.1",
//         deviceType: "mobile",
//       },
//     };
//  const payload = {
//     "accountReference":"abc1niui23",
//     "accountName":"Test Reserved Account",
//     "currencyCode":"NGN",
//     "contractCode":"100693167467",
//     "customerEmail":"test@tester.com",
//     "customerName":"John Doe",
//     "bvn":"21212121212",
//     "getAllAvailableBanks":true,
//     "incomeSplitConfig": [
//         {
//             "subAccountCode": "MFY_SUB_322165393053",
//             "feePercentage": 10.5,
//             "splitAmount": 20,
//             "feeBearer": true
//         }
//     ],
//     "metaData": {
//         "ipAddress": "127.0.0.1",
//         "deviceType": "mobile"
//     }
// }
// //  const payload = [
// // 	{
// // 		"currencyCode": "NGN",
// // 		"bankCode": "058",
// // 		"accountNumber": "0211319282",
// // 		"email": "tamira1@gmail.com",
// // 		"defaultSplitPercentage": 20.87
// // 	}
// // ]
    

// const createSubaccount = await axios.post(
// //   'https://sandbox.monnify.com/api/v1/sub-accounts',
//   'https://sandbox.monnify.com/api/v1/sub-accounts',
//   payload,
//   {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       'Content-Type': 'application/json'
//     }
//   }
// );

// console.log('Subaccount Created:', createSubaccount.data);


//     // const walletRes = await axios.post(
//     //   'https://sandbox.monnify.com/api/v1/bank-transfer/reserved-accounts',
//     //   userCredit,
//     //   {
//     //     headers: {
//     //       Authorization: `Bearer ${accessToken}`,
//     //       'Content-Type': 'application/json',
//     //     },
//     //   }
//     // );

//     return res.status(201).json(authRes.data);
//   } catch (err) {
//     console.error(err?.response?.data || err.message);
//     return res.status(401).json({
//       message: 'Failed to create reserved account',
//       error: err?.response?.data || err.message,
//     });
//   }
// };

    const edit_user=asynhandle(async(req,res)=>{
    
        const {firstname,lastname,Phone_no,password,gender,birth,username,transaction_pin} =req.body;

            const {file}=req.file
        
            const find_user=await User_reg.findOne({username}).exec()

            if(!find_user){
                return res.status(401).json({"message":`${username} not found`})
            }

            if(firstname){

                find_user.firstname=firstname
            
            }else if(lastname){

                find_user.lastname=lastname
            }else if(Phone_no){
                
                find_user.Phone_no=Phone_no
            }else if(password){

                find_user.password=password
            }else if(gender){
                find_user.gender=gender

            }
            else if(birth){
                find_user.birth=birth

            }
            else if(transaction_pin){
                find_user.transaction_pin=transaction_pin

            }
            else if(file){
                find_user.img=file

            }

            const saves=await find_user.save()

            res.status(201).json({"message":'User updated '})

        
            

    })


    const delete_user=asynhandle(async(req,res)=>{

        const {id}=req.body;

        if(!id){
            return res.status(401).json({"message":"empty userId "})
        }
        const found=await User_reg.findByIdAndDelete({_id:id})
        res.status(201).json({"message":"user deleted"})

    })

    const transaction=asynhandle(async(req,res)=>{
        const {id,from,to,product_name}=req.body;

        if(!id){
            return res.status(201).json({"message":"Empty UserId"})
        }
        const found =await User_reg.findByIdAndUpdate(id,{
            $push:{
                transaction:[{
                    from,
                    to,
                    product_name,
                    date:new Date().toISOString().split('T')[0],
                    refrenceId:Date.now(),
                }]
            }
        })

        if(!found){
            return res.status(401).json({"message":"UserId not found"})
        }

        res.status(201).json(found.transaction.at(-1))
      
        req.originalUrl.emit('notify',found.transaction.at(-1))

    })


module.exports={Regs,Get,edit_user,delete_user,transaction,test}