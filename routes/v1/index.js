const express = require('express');
const router = express.Router();
const jwt=require('jsonwebtoken');
const roleControllers=require('../../controllers/roleControllers');
const userControllers=require('../../controllers/userControllers');

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).json({ message: 'Token not provided' });
    }
  
    const token = authHeader.split(' ')[1];

    // console.log(token);
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ "status": false,
        "errors": [
          {
            "message": "You need to sign in to proceed.",
            "code": "NOT_SIGNEDIN"
          }
        ]});
      }
    //   console.log(decoded);
      req.id = decoded.user.id;
      console.log(req.id,'Req');
      next();
    });
  }

router.get('/role', roleControllers.getAll);
router.post('/role', roleControllers.create);
router.post('/auth/signup', userControllers.signup);
router.post('/auth/signin', userControllers.signin);
router.get('/auth/me', verifyToken, userControllers.userinfo);

module.exports=router;