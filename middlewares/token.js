const jwt = require('jsonwebtoken');

const checkToken = (req) => {
  let token = req;
  return new Promise((resolve, reject) => {
    if (!token) {

      reject({ success: false, message: 'No token' });
    } else if (token) {

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
        
          reject({ success: false, err, message: 'No token' });
        
        } else {
        
         

          resolve({
            username:decoded.username,
            success: true,
            message: 'Token is valid',
          });
        }
      });
    } else {
      reject({
        success: false,
        message: 'No Token supplied',
      });
    }
  });
};

module.exports = { checkToken };
