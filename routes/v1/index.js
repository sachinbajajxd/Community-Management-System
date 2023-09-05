const express = require('express');
const router = express.Router();
const jwt=require('jsonwebtoken');
const roleControllers=require('../../controllers/roleControllers');
const userControllers=require('../../controllers/userControllers');
const communityControllers=require('../../controllers/communityControllers');
const memberControllers=require('../../controllers/memberControllers');

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
      // console.log(req.id,'Req');
      next();
    });
  }

//ROLE
router.get('/role', roleControllers.getAll);
router.post('/role', roleControllers.create);

//USER AUTH
router.post('/auth/signup', userControllers.signup);
router.post('/auth/signin', userControllers.signin);
router.get('/auth/me', verifyToken, userControllers.userinfo);

//COMMUNITY
router.post('/community', verifyToken, communityControllers.create);
router.get('/community', communityControllers.getAllCommunities);
router.get('/community/:id/members', communityControllers.getAllMembers);
router.get('/community/me/owner', verifyToken, communityControllers.getOwnedCommunities);
router.get('/community/me/member', verifyToken, communityControllers.getMemberCommunities);

//MEMBER
router.post('/member', verifyToken, memberControllers.addMember);
router.delete('/member/:id', verifyToken, memberControllers.removeMember);

router.get('*', (req, res) =>{
  res.status(404).json({ status: false, message: 'Page not found' });
})

module.exports=router;