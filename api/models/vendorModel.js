'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    uppercase:true,
  },
  mob: {
    type: Number,
    required: true,
  },
  mail: {
    type: String,
    required: true,
    unique:true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  add: {
    type: String,
    uppercase:true
  },
  city: {
    type: String,
    uppercase: true,
  },

  pc: Number,
  lic: {
    type: String,
    uppercase: true,
  },
  st: {
    type: String,
    uppercase: true,
  },
  country: {
    type: String,
    uppercase: true,
  },
  status:{
      type:String,
      enum:["Active", "Inactive"],
      default:"Active"
  },

  verificationToken: String,
  
  verified:{
    type:Boolean,
    default:true
  },
  vehicle: [
    {
      name: {
        type: String,
        uppercase:true
      },
       num: {
        type: String,
        uppercase:true
      },
      type: {
        type: String,
        enum: ["four wheeler", "two wheeler"],
        
      },
      def:{
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
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPassWordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() 
  return resetToken;
};

export const User = mongoose.model("user", userSchema);
