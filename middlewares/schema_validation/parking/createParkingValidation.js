const { body, validationResult } = require('express-validator');
const parkingFields = ['name', 'landmark', 'pincode', 'address_line1', 'address_line2', 'city', 'state', 'country', 'capacity', 'registeration_no', 'validity_date',  'price', 'exceed_price', 'latitude', 'longitude', 'price_for', 'exceed_price_for',  'full_day', 'sheded', 'description'];
exports.validateParking = parkingFields.map(field => {
   
   if (field === 'validity_date') {
    return body(field).isDate().withMessage(`${field.replace('_', ' ')} must be a valid date`).isBefore().withMessage("It is before today!!!");
  }
  else if (field === 'capacity') {
    return body(field).notEmpty().withMessage("Empty").isInt().withMessage(`${field.replace('_', ' ')} must be an integer`).isInt({ min: 10, max: 1000 }).withMessage('Value must be less than 10');

  }
  else if (field === 'price') {
    return body(field).notEmpty().withMessage("Empty").isInt().withMessage(`${field.replace('_', ' ')} must be an integer`).isInt({ min: 20, max: 5000 }).withMessage('Value must be less than 10');

  }
  else if (field === 'exceed_price') {
    return body(field).notEmpty().withMessage("Empty").isInt().withMessage(`${field.replace('_', ' ')} must be an integer`).isInt({ min: 5, max: 500 }).withMessage('Value must be less than 10');

  }
  else if (field === 'pincode') {
    return body(field).notEmpty().withMessage("Empty").isInt().withMessage("Pincode must be an Numeric Value").isLength({ min: 6 }).withMessage(`${field.replace('_', ' ')} must be greater then 6 digits`);

  }
  else if (field === 'description') {
    return body(field).notEmpty().withMessage("Empty").isLength({ min: 300, max: 1000 }).withMessage(`${field.replace('_', ' ')} must be greater than 300 character and less than 1000 character`);

  }
 
  else if (['price_for', 'exceed_price_for'].includes(field)) {
    return body(field).notEmpty().withMessage("Empty").isInt().withMessage(`${field.replace('_', ' ')} must be an integer`)
  }
  else {
    return body(field).notEmpty().withMessage(`${field.replace('_', ' ')} is required`);
  }
});



// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); // Move to the next middleware
};
