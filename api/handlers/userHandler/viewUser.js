const userModel = require("../../models/userModel");

exports.viewUser = async (req, res) => {
   
   
      try {
        console.log(req.user)
        const response = await userModel.findOne({ uniqueId:req.user });
        if (response.length === 0) {
          res.status(400).json({
            success: false,
            message:
             "Not found",
            data: null,
          });
        } else {
        
          res.status(200).json({
            success: true,
            message: 'User Information ',
            data: response,
          });
        }
        
      } catch (err) {
        res.status(400).json({
          success: false,
          message: 'Something went wrong, please try again',
          data: null,
        });
      }
    
  };