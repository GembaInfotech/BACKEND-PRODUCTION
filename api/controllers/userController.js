const bcrypt = require('bcryptjs');
const sanitize = require('mongo-sanitize');
const { checkToken } = require('../../middlewares/token');
const { createUser, validateUserAccount } = require('../handlers/userHandler/createUser');
const { changePassword, verifyNewPassword, getResetCode } = require('../handlers/userHandler/passwordChange');
const { loginUser } = require('../handlers/userHandler/loginUser');
const { isAuthorized } = require('../../middlewares/authMiddleware/isAuthorized');
const { viewUser } = require('../handlers/userHandler/viewUser');


exports.authMiddleWare = async (req, res, next) => {
  try {
    await isAuthorized(req, res, next);
  }
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
exports.viewUser = async (req, res, next) => {
  try {
    await viewUser(req, res, next);
  }
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}


exports.login_user = async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.create_new_user = async (req, res) => {
  try {
    await createUser(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.validate_user_email_and_account = async (req, res) => {
  try {
    await validateUserAccount(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.get_reset_password_code = async (req, res) => {
  try {
    await getResetCode(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.verify_new_user_password = async (req, res) => {
  try {
    await verifyNewPassword(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.change_password = async (req, res) => {
  try {
    await changePassword(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.delete_user_account = async (req, res) => {
  const { password, uniqueId } = req.body;
  if (!password) {
    res.status(400).json({
      success: false,
      message: 'Please provide your password',
      data: null,
    });
  } else {
    try {
      const user = await User.findOne({ uniqueId: sanitize(uniqueId) });
      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Oh, something went wrong. Please try again!',
          data: null,
        });
      } else {
        const pwCheckSuccess = await bcrypt.compare(password, user.password);

        if (!pwCheckSuccess) {
          res.status(400).json({
            success: false,
            message: 'The provided password is not correct.',
            data: null,
          });
        } else {
          const deleted = await User.deleteOne({
            email: user.email,
          });

          if (!deleted) {
            res.status(400).json({
              success: false,
              message: 'Oh, something went wrong. Please try again!',
              data: null,
            });
          } else {
            res.status(200).json({
              success: true,
              message: 'Account deleted successfully',
              data: null,
            });
          }
        }
      }
    } catch (err) {
      console.log('Error on /api/auth/delete-account: ', err);
      res.status(400).json({
        success: false,
        message: 'Oh, something went wrong. Please try again!',
        data: null,
      });
    }
  }
};


exports.check_token_valid_external = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Parameters',
      data: null,
    });
  }
  try {
    let tokenValid = await checkToken(token);
    if (!tokenValid) {
      res.status(400).json({
        success: false,
        message: 'Token Not Valid',
        data: null,
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Token Valid',
        data: null,
      });
    }
  } catch {
    res.status(500).json({
      success: false,
      message: 'Oh, something went wrong checking token. Please try again!',
      data: null,
    });
  }
};
