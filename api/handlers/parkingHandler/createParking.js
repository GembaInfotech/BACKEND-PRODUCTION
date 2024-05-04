const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const cryptoRandomString = require('crypto-random-string');
const { v4: uuidv4 } = require('uuid');
const sanitize = require('mongo-sanitize');
// const {
//   checkEmailExists,
//   validateEmail,
// } = require('../../../middlewares/validators');
// const { checkToken } = require('../../../middlewares/token');
// const { sendEmail } = require('../../../middlewares/utils/emailService');
// const UserModel = require('../../models/userModel');
const ParkingModel = require('../../models/parkingModel');
const { validateParking, handleValidationErrors } = require('../../../middlewares/schema_validation/parking/createParkingValidation');

const { formatDate } = require('../../../middlewares/utils/dateFormatter');





const parkingFields = ['name', 'landmark', 'pincode', 'address_line1', 'address_line2', 'city', 'state', 'country', 'capacity', 'registeration_no', 'validity_date',  'price', 'exceed_price', 'latitude', 'longitude', 'price_for', 'exceed_price_for',  'full_day', 'sheded', 'description'];


exports.createParking =
  async (req, res) => {  {
        const parkingData = {};
        parkingFields.forEach(field => {
          parkingData[field] = req.body[field];
        });
    
    
         parkingData["status"] ="pending"
         parkingData["isActive"] =false
         parkingData["validity_date"] = formatDate(req.body.validity_date, 'dd-MM-yyyy')
         parkingData
         
         
        try {
          const parking = new ParkingModel(
            parkingData
          )
    
          const parkingcreated = await parking.save();
          console.log(parkingcreated);
          res.status(201).json({ message: 'Parking created successfully', parking: parkingcreated });
        }
        catch (err) {
          res.json(err);
        }
      }}
  
