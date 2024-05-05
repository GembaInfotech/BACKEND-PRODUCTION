const bcrypt = require('bcryptjs');
const sanitize = require('mongo-sanitize');
const cryptoRandomString = require('crypto-random-string');

const { sendEmail } = require('../../../middlewares/utils/emailService');
const UserModel = require('../../models/userModel');
const Code = require('../../models/codeModel');



exports.verifyNewPassword = async (req, res) => {
    const { email, password, password2, code } = req.body;
    if (!email || !password || !password2 || !code) {
      res.status(400).json({
        success: false,
        message: 'Please fill in all fields!',
        data: null,
      });
    } else if (password !== password2) {
      res.status(400).json({
        success: false,
        message: 'The entered passwords do not match!',
        data: null,
      });
    } else if (
      !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          'Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.',
        data: null,
      });
    } else {
      try {
        const response = await Code.findOne({ email: email, code: code });
        if (response.length === 0) {
          res.status(400).json({
            success: false,
            message:
              'The entered code is not correct. Please make sure to enter the code in the requested time interval.',
            data: null,
          });
        } else {
          const newHashedPw = await bcrypt.hashSync(password, 10);
          await UserModel.updateOne(
            { email: sanitize(email) },
            { $set: { password: newHashedPw } }
          );
          await Code.deleteOne({ email, code });
          res.status(200).json({
            success: true,
            message: 'Password reset successfully',
            data: null,
          });
        }
      } catch (err) {
        res.status(400).json({
          success: false,
          message: 'Something went wrong, please try again',
          data: null,
        });
      }
    }
  };
  
  exports.getResetCode = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Please provide your registered email address!',
        data: null,
      });
    } else {
      try {
        const user = await UserModel.findOne({ email: sanitize(email) });
  
        if (!user) {
          res.status(400).json({
            success: false,
            message: 'The provided email address is not registered!',
            data: null,
          });
        } else {
          const secretCode = cryptoRandomString({
            length: 6,
          });
          const newCode = new Code({
            code: secretCode,
            email: email,
          });
          await newCode.save();
          const data = {
            from: `PARKAR <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: 'Your Password Reset Code for YOUR APP',
            text: `Please use the following code within the next 10 minutes to reset your password on YOUR APP: ${secretCode}`,
            html: `<p>Please use the following code within the next 10 minutes to reset your password on YOUR APP: <strong>${secretCode}</strong></p>`,
          };
          await sendEmail(data);
          res.status(201).json({
            success: true,
            message: 'Code send successfully',
            data: null,
          });
        }
      } catch (err) {
        res.status(400).json({
          success: false,
          message: 'Something went wrong getting a code to reset email',
          data: null,
        });
      }
    }
  };  

exports.changePassword = async (req, res) => {
    const { email, password, password2, code } = req.body;
    if (!email || !password || !password2 || !code) {
      res.status(400).json({
        success: false,
        message: 'Please fill in all fields!',
        data: null,
      });
    } else if (password !== password2) {
      res.status(400).json({
        success: false,
        message: 'The entered passwords do not match!',
        data: null,
      });
    } else if (
      !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          'Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.',
        data: null,
      });
    } else {
      try {
        const response = await Code.findOne({ email: email, code: code });
        if (response.length === 0) {
          res.status(400).json({
            success: false,
            message:
              'The entered code is not correct. Please make sure to enter the code in the requested time interval.',
            data: null,
          });
        } else {
          const newHashedPw = await bcrypt.hashSync(password, 10);
          await UserModel.updateOne(
            { email: sanitize(email) },
            { $set: { password: newHashedPw } }
          );
          await Code.deleteOne({ email, code });
          res.status(200).json({
            success: true,
            message: 'Password reset successfully',
            data: null,
          });
        }
      } catch (err) {
        res.status(400).json({
          success: false,
          message: 'Something went wrong, please try again',
          data: null,
        });
      }
    }
  };