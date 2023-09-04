const Role = require('../models/Role');
const validator = require('validator');
const {Snowflake} = require('@theinternetfolks/snowflake');

module.exports.create = async(req, res) => {
    
    try{
        const name=req.body.name;
        // console.log(name);

        if (!validator.isLength(name, { min: 2 })) {
            errors.push({param:'name',
                        email:'Name should be at least 2 characters.',
                        code:'INVALID_INPUT'})
        }

        // Check if role already exists
        const existingRole = await Role.findOne({ name });
    
        if (existingRole) {
          return res.status(400).json({ status: false,
                                        message: 'Role already exists' });
        }

        // Create role
        const role = new Role({
            id: Snowflake.generate(),
            name,
          });
      
          await role.save();
  
          console.log("user", role);

        return res.status(200).json({
            status: true,
            content: {
              data: {
                id: role.id,
                name: role.name,
                created_at: role.created_at,
                updated_at: role.updated_at
              }
            }
          })

    } catch(error){
        return res.status(500).json({message: "Internal server error", success: false});
    }
}

module.exports.getAll = async(req, res) => {

    const page = parseInt(req.query.page) || 1; // Current page number (default: 1)
    const perPage = 10; // Number of documents per page

    try {
        // Count the total number of documents
        const total = await Role.countDocuments();
    
        // Calculate the total number of pages
        const totalPages = Math.ceil(total / perPage);
    
        // Fetch records with pagination
        const roles = await Role.find()
          .skip((page - 1) * perPage) // Skip records on previous pages
          .limit(perPage); // Limit the number of records per page
    
        // Create the metadata object
        const meta = {
          total,
          pages: totalPages,
          page,
        };
    
        res.status(200).json({
            status:true,
            content: {
                meta,
                data: roles
            }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    

}