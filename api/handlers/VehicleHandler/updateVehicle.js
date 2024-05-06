const UserModel = require('../../models/userModel');
exports.updateVehicle = async (req, res) => {
    const userId = req.user; 
    const vehicleId = req.params.vehicleId; 
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
  
      const vehicleIndex = user.vehicle.findIndex(vehicle => vehicle._id == vehicleId);
      if (vehicleIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found',
          data: null,
        });
      }
  
      user.vehicle[vehicleIndex].vehicle_name = vehicle_name.toUpperCase();
      user.vehicle[vehicleIndex].vehicle_number = vehicle_number.toUpperCase();
      user.vehicle[vehicleIndex].vehicle_type = vehicle_type;
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'Vehicle updated successfully',
        data: user.vehicle[vehicleIndex],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null,
      });
    }
  };
  