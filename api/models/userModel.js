'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserModel', UserSchema);
