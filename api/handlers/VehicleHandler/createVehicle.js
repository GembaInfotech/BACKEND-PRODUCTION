const UserModel = require('../../models/userModel');

exports.createVehicle = async (req, res) => {
    const userId = req.user;
    const { vehicle_name, vehicle_number, vehicle_type } = req.body;
  
    try {
      const user = await UserModel.findOne({uniqueId:userId});
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          data: null,
        });
      }
  
      const newVehicle = {
        vehicle_name: vehicle_name.toUpperCase(),
        vehicle_number: vehicle_number.toUpperCase(),
        vehicle_type,
      };
  
      user.vehicle.push(newVehicle);
  
      await user.save();
  
      res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: newVehicle,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error while creating vehicle',
        data: null,
      });
    }
  };
  