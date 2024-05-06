const UserModel = require('../../models/userModel');

exports.viewVehicleList = async (req, res) => {
    console.log("helloo");
    const userId = req.user
    console.log("helloo");
    try {
        console.log("hello");
        const user = await UserModel.findOne({ uniqueId: userId })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null,
            });
        }
        console.log(user);
        const vehicleList = user.vehicle;
        console.log(vehicleList);

        res.status(200).json({
            success: true,
            message: 'Vehicle list retrieved successfully',
            data: vehicleList,
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
