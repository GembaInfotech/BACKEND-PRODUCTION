// commonController.js
const { createParking } = require('../handlers/parkingHandler/createParking');
const { validateParking, handleValidationErrors } = require('../../middlewares/schema_validation/parking/createParkingValidation');


exports.create_new_parking = [ 
  validateParking,
  handleValidationErrors,
  async (req, res) => {
  try {

    await createParking(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}];

// exports.handleUpdateParking = async (req, res) => {
//   try {
//     await updateParking(req, res);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// exports.handleDeleteParking = async (req, res) => {
//   try {
//     await deleteParking(req, res);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// exports.handleGetParking = async (req, res) => {
//   try {
//     await getParking(req, res);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
