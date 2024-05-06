'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const { format } = require('date-fns');



const UserSchema = new Schema(
  {
   
    contact: {
      type: Number,
    },
   
    pincode: {
      type: String,
    
    
    },
    address: {
      type: String,
     
      uppercase:true
    },
   
    city: {
      type: String,
    
      uppercase:true

    },
    state: {
      type: String,
      required: false,
      uppercase:true

    },
    country: {
      type: String,
      required: false,
      uppercase:true

    },
   
    licence_no: {
      type: String,
      uppercase: true,
    },
   
   
  
 
    vehicle: [
      {
        vehicle_name: {
          type: String,
          uppercase:true
        },
         vehicle_number: {
          type: String,
          uppercase:true
        },
        vehicle_type: {
          type: String,
          enum: ["four wheeler", "two wheeler"],
          
        },
        isDefault:{
          type:Boolean,
          default:false,
         
        }
      },
    ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],


    firstName: {
      type: String,
      required: false,
      uppercase:true
    },
    lastName: {
      type: String,
      required: false,
      uppercase:true
    },
    email: {
      type: String,
      required: true,
      lowercase:true
    },
    password: {
      type: String,
      required: true,
    },
    createdOnDate: {
      type: String,
    },
    userActive: {
      type: Boolean,
      default: false,
    },
    acceptedTerms: {
      type: Boolean,
    },
    userStatus: {
      type: String,
      enum:["pending", "active", "inactive"],
      default: 'pending',
    },
    uniqueId: {
      type: String,
      required: false,
    },
    tokens:[{
     
      reftoken:{
    type:String
      },
      timeStamp:{
        type:String
      }
    }]
  },
  { timestamps: true }
);


UserSchema.methods.generateRefreshToken = async function(){
  try{
   let reftoken = jwt.sign(
      { username: this.uniqueId },
      process.env.JWT_SECRET,
      {
        // TODO: SET JWT TOKEN DURATION HERE
        expiresIn:  '1h',
      }
    );
    let timeStamp =  format(new Date(), 'Pp');
    this.tokens= this.tokens.concat({reftoken, timeStamp});
    await this.save();
    return reftoken;
  } catch(err){
    console.log("Error")
  }
}
UserSchema.methods.generateAuthToken = async function(){
  try{
   let token = jwt.sign(
      { username: this.uniqueId },
      process.env.JWT_SECRET,
      {
        // TODO: SET JWT TOKEN DURATION HERE
        expiresIn:  '10m',
      }
    );
  
    return token;
  } catch(err){
    console.log("Error")
  }
}
module.exports = mongoose.model('UserModel', UserSchema);
