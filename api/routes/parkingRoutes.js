'use strict';
module.exports = (app) => {
  const parkingController = require('../controllers/parkingController');
  
  app.route('/api/v1/parking/create-new-parking').post(parkingController.create_new_parking);
  // app
  //   .route('/api/v1/parking/create-new-user')
  //   .post(parkingController.create_new_user);
//   app
//     .route('/api/v1/parking/verification/verify-account/:uniqueId/:secretCode')
//     .get(parkingController.validate_user_email_and_account);
//   app
//     .route('/api/v1/parking/password-reset/get-code')
//     .post(parkingController.get_reset_password_code);
//   app
//     .route('/api/v1/parking/password-reset/verify-code')
//     .post(parkingController.verify_new_user_password);
//   app
//     .route('/api/v1/parking/delete-account')
//     .post(parkingController.delete_user_account);
//   app
//     .route('/api/v1/parking/check-token-valid-external/:token')
//     .get(parkingController.check_token_valid_external);
 };
