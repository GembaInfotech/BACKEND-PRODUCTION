const UserModel = require('../../models/userModel');

exports.deleteVehicle = async (req, res) => {
    const userId = req.user;
    const vehicleId = req.params.vehicleId; 
  
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
          message: 'Invalid Request. Vehicle not found',
          data: null,
        });
      }

      user.vehicle.splice(vehicleIndex, 1);
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully',
        data: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error While deleting Vehicle ',
        data: null,
      });
    }
  };
  