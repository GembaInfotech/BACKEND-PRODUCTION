'use strict';
module.exports = (app) => {
  const authController = require('../controllers/userController');
  const vehicleController = require('../controllers/vehicleController')
  app.route('/api/v1/vehicle/create-new-vehicle').post(authController.authMiddleWare, vehicleController.create_new_vehicle);

  app.route('/api/v1/vehicle/update-vehicle/:vehicleId').put(authController.authMiddleWare, vehicleController.update_vehicle);

  app.route('/api/v1/vehicle/set-vehicle-default/:vehicleId').put(authController.authMiddleWare, vehicleController.set_vehicle_default);

  app.route('/api/v1/vehicle/view-vehicle-list').get(authController.authMiddleWare, vehicleController.view_vehicle_list);

  app.route('/api/v1/vehicle/delete-vehicle/:vehicleId').delete(authController.authMiddleWare, vehicleController.delete_vehicle);

};
