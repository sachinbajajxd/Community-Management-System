const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const userControllers=require('../controllers/userControllers');
const jwt=require('jsonwebtoken');


router.get('/', (req, res) => {
    console.log("Hello we are on home page");
    res.json(202);
});

router.use('/v1', require('./v1'));




module.exports = router;