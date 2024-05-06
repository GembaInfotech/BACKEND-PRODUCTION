const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');
const UserModel = require('../../models/userModel');

exports.loginUser = async (req, res) => {
    const { email, password, rememberMe } = req.body;
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please fill in all fields!',
        data: null,
      });
    } else {
      try {
        const user = await UserModel.findOne({ email: sanitize(email) });
        if (!user) {
          res.status(400).json({
            success: false,
            message: 'The provided email is not registered.',
            data: err,
          });
        } else {
          if(user.tokens.length){
            res.json({
              "success":"failed",
              "message":"Another session is running on different device. Kindly logout from another device and then try again. Thank You!!",
              "login":user.tokens[0].timeStamp,
              data:null
            })    
           
          }
          else{
            const pwCheckSuccess = await bcrypt.compare(password, user.password);
            if (!pwCheckSuccess) {
              res.status(400).json({
                success: false,
                message: 'Email and password do not match.',
                data: err,
              });
            } else {
              let token = await user.generateAuthToken()
              let reftoken = await user.generateRefreshToken()
            
              
              res.cookie('token', token, {
                path: '/',
                httpOnly :true,
                sameSite:"lax",
               expires: new Date(Date.now()+ 1000 * 10 * 60)
              });
              res.cookie('reftoken', reftoken, {
                 path: '/',
                 httpOnly :true,
                 sameSite:"lax",
                expires: new Date(Date.now()+ 1000 * 60 * 60)
    
              });
            
           
              
             
    
    
              res.status(200).json({
                success: true,
                message: 'Successfully logged in',
                 token,
                 reftoken
              });
            }
          }
         
        }
      } catch {
        res.status(400).json({
          success: false,
          message: 'Something went wrong.',
          data: null,
        });
      }
    }
  };