const Community = require('../models/Community');
const User = require('../models/User');
const validator = require('validator');
const {Snowflake} = require('@theinternetfolks/snowflake');

module.exports.create = async(req, res) => {

    function generateSlug(name) {
        // Convert the name to lowercase
        const lowercaseName = name.toLowerCase();
      
        // Replace spaces with hyphens and remove special characters
        const slug = lowercaseName
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/[^a-z0-9-]/g, '') // Remove special characters
      
        return slug;
      }

    const name=req.body.name;
    const owner=req.id;
    console.log(owner, "owner");
    const slug=generateSlug(name);

    try{
        // Validate the username
        if (!validator.isLength(name, { min: 2 })) {
            errors.push({param:'name',
                        email:'Name should be at least 2 characters.',
                        code:'INVALID_INPUT'})
        }

        // Create new community
        const community = new Community({
            id: Snowflake.generate(),
            name,
            slug,
            owner
          });
      
          await community.save();
  
          console.log("community", community);

          return res.status(200).json({
            status: true,
            community
          })

          //TODO push the user into member
    } catch(error){
        return res.status(500).json({error});
    }

}

module.exports.getAllCommunities = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number (default: 1)
    const perPage = 10; // Number of documents per page
  
    try {
      // Query to get total number of documents
      const total = await Community.countDocuments();
  
      // Calculate total number of pages
      const totalPages = Math.ceil(total / perPage);
  
      // Query to fetch communities with pagination
      const communities = await Community.find()
        .skip((page - 1) * perPage)
        .limit(perPage)

        const modifiedCommunities = [];
  
      // Iterate through the communities and populate the owner field with id and name
      for (const community of communities) {
        const id = community.owner;
        // console.log(own, "Owner");
        const owner = await User.findOne({id});
        
        modifiedCommunities.push({
            ...community.toObject(), // Convert the Mongoose document to a plain object
            owner: {
                id,
                name:owner.name
            } 
        });
      }
      // Create the response object
      const response = {
        status: true,
        content: {
          meta: {
            total,
            pages: totalPages,
            page,
          },
          data: modifiedCommunities,
        },
      };
  
      // Send the response
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};