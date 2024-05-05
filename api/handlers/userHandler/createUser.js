const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const cryptoRandomString = require('crypto-random-string');
const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns');
const {
  checkEmailExists,
  validateEmail,
} = require('../../../middlewares/validators');
const { sendEmail } = require('../../../middlewares/utils/emailService');
const UserModel = require('../../models/userModel');
const Code = require('../../models/codeModel');

exports.createUser = async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      password2,
      acceptedTerms,
    } = req.body;
    const emailCheck = await checkEmailExists(email);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        data: null,
      });
    } else if (!email || !password || !password2) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        data: null,
      });
    } else if (password != password2) {
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
    } else if (!acceptedTerms) {
      res.status(400).json({
        success: false,
        message: 'You need to accept the terms of use.',
        data: null,
      });
    } else if (!validateEmail(email)) {
      res.status(400).json({
        success: false,
        message: 'Email address has invalid format',
        data: null,
      });
    } else if (!emailCheck) {
      res.status(400).json({
        success: false,
        message: 'Email already exists',
        data: null,
      });
    } else {
      try {
    
        const newUser = new UserModel({
          firstName: firstName ? firstName : '',
          lastName: lastName ? lastName : '',
          email: email,
          password: bcrypt.hashSync(req.body.password, 14),
          acceptedTerms: true,
          createdOnDate: format(new Date(), 'dd/MM/yyyy'),
          uniqueId: uuidv4(),
        });
      
        const user = await newUser.save();
        const token = jwt.sign(
          { username: user.uniqueId },
          process.env.JWT_SECRET,
          {
            // TODO: SET JWT TOKEN DURATION HERE
            expiresIn: '24h',
          }
        );
        const baseUrl = req.protocol + '://' + req.get('host');
        const secretCode = cryptoRandomString({
          length: 6,
        });
        const newCode = new Code({
          code: secretCode,
          email: user.email,
        });
        await newCode.save();

        const data = {
          from: `Parkar <${process.env.EMAIL_USERNAME}>`,
          to: user.email,
          subject: 'Your Activation Link for Parkar App',
          text: `Please use the following link within the next 10 minutes to activate your account on YOUR APP: ${baseUrl}/api/auth/verification/verify-account/${user.uniqueId}/${secretCode}`,
          html: `<p>Please use the following link within the next 10 minutes to activate your account on YOUR APP: <strong><a href="${baseUrl}/api/v1/auth/verification/verify-account/${user.uniqueId}/${secretCode}" target="_blank">Email Verification Link</a></strong></p>`,
        };
        await sendEmail(data);
        res.status(201).json({
          success: true,
          message: 'User created',
          data: { uniqueId: user.uniqueId, token: token, tasks: null },
        });
      } catch {
        res.status(400).json({
          success: false,
          message: 'General Error Creating new account',
          data: null,
        });
      }
    }
  };



  exports.validateUserAccount = async (req, res) => {
    try {
      const user = await UserModel.findOne({
        uniqueId: sanitize(req.params.uniqueId),
      });
      const response = await Code.findOne({
        email: user.email,
        code: sanitize(req.params.secretCode),
      });
  
      if (!user) {
        res.sendStatus(401);
      } else {
        await UserModel.updateOne(
          { email: user.email },
          { $set: { userStatus: 'active', userActive: true } }
        );
        await Code.deleteMany({ email: user.email });
  
        let redirectPath;
  
        if (process.env.NODE_ENV == 'production') {
          redirectPath = `${req.protocol}://${req.get('host')}account/verified`;
        } else {
          redirectPath = `http://127.0.0.1:8080/account/verified`;
        }
  
        res.redirect(redirectPath);
      }
    } catch (err) {
      res.status(500).send("Token Expired");
    }
  };  