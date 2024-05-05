const { checkToken } = require('../../middlewares/token');
const jwt = require('jsonwebtoken');

const  refreshToken = async (req,res)=>{
    let exists = false;
    const cookies = req.headers?.cookie;  
    const reftoken = cookies?.split("=")[1]
    const tokenType = cookies?.split("=")[0]

    if (!cookies || tokenType=="token" && reftoken ) {

      res.status(400).json({
        success: false,
        message: ' refresh token is expired',
        data: null,
      });
    }
      else
      { 

        try{
          let tokenValid = await checkToken(reftoken);

          if(tokenValid.success)
          {
         console.log(tokenValid.username)
            let tokend = jwt.sign(
              { username: tokenValid.username },
              process.env.JWT_SECRET,
              {
                // TODO: SET JWT TOKEN DURATION HERE
                expiresIn:  '10m',
              }
            );

            req.user =tokenValid.username
            res.cookie('token', tokend, {
              path: '/',
              httpOnly :true,
              sameSite:"lax",
              expires: new Date(Date.now()+ 1000 * 10 * 60)
            });
           
            exists=true
          }
          else{

            return exists
          }
         
        }
        catch{
  
           return exists
        }
      }
      return exists
  
  }

exports.isAuthorized = async (req, res, next)=>{
  
    const cookies = req.headers?.cookie;
    const token = cookies?.split("=")[2];
   
   
    if ( !token) {
     
      const refreshed = await refreshToken(req,res)
        if(refreshed){
          next();
        }
    }
      else
      { 
        try{
          let tokenValid = await checkToken(token);
 
          if(tokenValid.success)
          {
            req.user =tokenValid.username
            next();
          }
          else{
            return res.json("error")
          }
         
        }
        catch{
          res.status(400).json({
            success: false,
            message: ` Token is invalid in database.`,
            data: null,
          });
        }
      }
      
  }

