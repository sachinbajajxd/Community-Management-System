const User = require('../models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const {Snowflake} = require('@theinternetfolks/snowflake');

module.exports.signup = async (req, res) => {


    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

    console.log(email, name, password);



    try {
        // Validation checks for email and password
        const errors = [];

        // Validate the username
        if (!validator.isLength(name, { min: 2 })) {
            errors.push({param:'name',
                        email:'Name should be at least 2 characters.',
                        code:'INVALID_INPUT'})
        }

        // Validate the email
        if (!validator.isEmail(email)) {
            errors.push({param:'email',
                        email:'Invalid email format',
                        code:'INVALID_INPUT'})
        }

        // Validate the password
        if (!validator.isLength(password, { min: 6 })) {
            errors.push({param:'password',
                        email:'Password must be at least 6 characters long',
                        code:'INVALID_INPUT'})
        }


        // Check if there are any validation errors
        if (errors.length > 0) {
            return res.status(400).json({ status: "false",
            errors });
        }


        // Check if username or email already exists
        const existingUser = await User.findOne({ email });
    
        if (existingUser) {
          return res.status(400).json({ status: 'false',
                                        message: 'Username or email is already taken' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create new user
        const user = new User({
          id: Snowflake.generate(),
          name,
          email,
          password: hashedPassword,
        });
    
        await user.save();

        console.log("user", user);
    
        jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: '2h'}, (err, token) => {
            if(err){
                res.json({
                    message: "There is some error"
                })
            }else{
                res.json({
                    status: "true",
                    content: {
                        data: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            created_at: user.created_at
                        },
                        meta: {
                            access_token: token
                        }
                    }
                });
            }
        })
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }

}

module.exports.signin = async (req, res) => {

    const email=req.body.email;
    const password=req.body.password;

    try {
        // Validation checks for email and password
        const errors = [];

        // Validate the email
        if (!validator.isEmail(email)) {
            errors.push({param:'email',
                        email:'Invalid email format',
                        code:'INVALID_INPUT'})
        }

        // Validate the password
        if (!validator.isLength(password, { min: 6 })) {
            errors.push({param:'password',
                        email:'Password must be at least 6 characters long',
                        code:'INVALID_INPUT'})
        }


        // Check if there are any validation errors
        if (errors.length > 0) {
            return res.status(400).json({ status: "false",
            errors });
        }


        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    
        jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: '2h'}, (err, token) => {
            if(err){
                res.json({
                    message: "There is some error"
                })
            }else{
                res.json({
                    status: "true",
                    message: "signup successful",
                    content: {
                        data: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            created_at: user.created_at
                        },
                        meta: {
                            access_token: token
                        }
                    }
                });
            }
        })
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }

}

module.exports.userinfo = async (req, res) => {

    try{
        const id = req.id;
        // console.log(id);

        const user = await User.findOne({ id });

        return res.json({
            status: "true",
            content: {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at
                }
            }
        });

        
    } catch(error){
        console.log('Error', error);
        return res.status(500).json({message: "There is some error"});
    }

}