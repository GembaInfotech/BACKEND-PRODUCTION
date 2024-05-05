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
          const pwCheckSuccess = await bcrypt.compare(password, user.password);
          if (!pwCheckSuccess) {
            res.status(400).json({
              success: false,
              message: 'Email and password do not match.',
              data: err,
            });
          } else {
            let token = jwt.sign(
              { username: user.uniqueId },
              process.env.JWT_SECRET,
              {
                // TODO: SET JWT TOKEN DURATION HERE
                expiresIn: rememberMe ? '48h' : '10m',
              }
            );
            let reftoken = jwt.sign(
              { username: user.uniqueId },
              process.env.JWT_SECRET,
              {
                // TODO: SET JWT TOKEN DURATION HERE
                expiresIn: rememberMe ? '48h' : '1h',
              }
            );
          
            
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
      } catch {
        res.status(400).json({
          success: false,
          message: 'Something went wrong.',
          data: null,
        });
      }
    }
  };