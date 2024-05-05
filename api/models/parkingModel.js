'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParkingSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim:true,
      uppercase:true
    },
    landmark: {
      type: String,
      required: false,
      trim:true,
      uppercase:true
    },
    pincode: {
        type: String,
        required: false,
        minlength :6
      },
      address_line1: {
        type: String,
        required: false,
        uppercase:true
      },
      address_line2: {
        type: String,
        required: false,
        uppercase:true

      },
      city: {
        type: String,
        required: false,
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
      capacity: {
        type: Number,
        required: false,
        min:10
      },
      registeration_no: {
        type: String,
        required: false,
         uppercase:true
      },
      validity_date: {
        type: String,
       
        required: false,

      },
      status: {
        type: String,
        enum:["pending", "active", "inactive"],
        default:"pending",
       
      },
      isActive: {
        type: Boolean,
       default:false
      },
      price: {
        type: Number,
        min:20,
        max:1000,
        required: false,
      },
      exceed_price: {
        type: Number,
        min:5,
        max:200,
        required: false,
      },
      latitude: {
        type: Number,
        
      },
      longitude: {
        type: Number,
        
      },      price_for: {
        type: Number,
        min:30,
        max:480,
        required: false,
      },
      mobile_no:{
        type:Number,

      },
    exceed_price_for: {
      type: Number,
      enum:[10,20,30],
      required: true,
    },
    
   
    createdOnDate: {
      type: String,
    },
    
    full_day: {
      type: Boolean,
      
    },
    sheded: {
        type: Boolean,
      },
    description:{
        type:String,
        required:true,
      
        
        
    },
    
    image:{
         type:String
    },
    regiseration_doc_image:{
        type:String
    },
    
    uniqueId: {
      type: String,
      required: false,
    },

    vendor_id:{
        type:String
    },
    guard_id:[
        {
            type:String
        }
    ]

  },
  { timestamps: true 
   
  }
);


const ParkingModel = mongoose.model('ParkingModel', ParkingSchema);


module.exports = ParkingModel;