const userModel = require("../../models/userModel");


exports.logoutUser = async (req, res) => {
    
      try {
        const user = await userModel.findOne({ uniqueId:req.user });

         user.tokens=[];
         await user.save();
         res.clearCookie('reftoken');
         res.clearCookie('token');
         res.json({
            "success":true,
            "message":"Logout Successfully"
         })
         
      } catch {
        res.status(400).json({
          success: false,
          message: 'Something went wrong.',
          data: null,
        });
      }
    
  };