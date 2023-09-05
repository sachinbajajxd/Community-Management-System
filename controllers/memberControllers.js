const Member = require('../models/Member');
const Community = require('../models/Community');
const User = require('../models/User');
const Role = require('../models/Role');
const validator = require('validator');
const {Snowflake} = require('@theinternetfolks/snowflake');

module.exports.addMember = async(req, res) => {

    async function getRoleId(){
        const name="Community Admin";
        const roleId=await Role.findOne({name});

        if(!roleId){
          const role = new Role({
            id: Snowflake.generate(),
            name,
          });
          await role.save();

          return role.id;
        }
        return roleId.id;
    }

    async function getAdmin(){
      let user=req.id;
      const admin=await Member.findOne({user});
      return admin;
    }

    let roleId=await getRoleId();

    const admin=await getAdmin();

    console.log(admin, "Admin details");

    if(!admin){
        return res.status(400).json({
            "status": false,
            "errors": [
              {
                "param": "user",
                "message": "User not found.",
                "code": "RESOURCE_NOT_FOUND"
              }
            ]
          })
    }

    console.log(admin.role,"admin.role");

    if(admin.role!=roleId){
        console.log(admin.role, "Admin.role");
        console.log(roleId, "RoleID");
        return res.status(400).json({
            "status": false,
            "errors": [
              {
                "message": "You are not authorized to perform this action.",
                "code": "NOT_ALLOWED_ACCESS"
              }
            ]
          });
    }

    try{

    // console.log(req.body);

        let community=req.body.community;
        let role=req.body.role;
        let user=req.body.user;

        if(!community || !role || !user){
          return res.status(500).json({
            "status": false,
            "errors": [
              {
                "param": "role/community/user",
                "message": "Role/community/user not found.",
                "code": "RESOURCE_NOT_FOUND"
              }
            ]
          })
        }

        // console.log(community);

        // Check if username or email already exists
        const existingMember = await Member.findOne({ community, role, user });

        if(existingMember){
          return res.status(500).json({
            "status": false,
            "errors": [
              {
                "message": "User is already added in the community.",
                "code": "RESOURCE_EXISTS"
              }
            ]
          })
        }

        const newMember = new Member({
            id: Snowflake.generate(),
            community,
            role,
            user
        });

        await newMember.save();

        console.log(newMember, "newMember");

        return res.json({newMember});

    }catch(err){
        return res.status(500).json({err});
    }
}

module.exports.removeMember = async(req, res) => {
    console.log("req.params.id", req.params.id);

    async function getRole(admin){
      const role=admin.role;
      let name="Community Admin";
      const roleId=await Role.findOne({name});

      if(roleId && (roleId.id==role)) return true;

      if(!roleId){
        let name="Community Moderator";
        const roleId=await Role.findOne({name});  
      }

      if(roleId && roleId.id==role) return true;
      // console.log(roleId.id, "Role id");
      //TODO handle the case if roleId is null
      return false;
    }

    async function getAdmin(){
      let user=req.id;
      const admin=await Member.findOne({user});
      return admin;
    }

    const id=req.params.id;
    // const user=req.id;

    try {
      // Find the member by ID
      const member = await Member.findOne({id});
  
      // Check if the member exists
      if (!member) {
        return res.status(404).json({ status: false, message: 'Member not found' });
      }
  
      // Check if the current user has the necessary authorization
      const admin=await getAdmin();
      const role=await getRole(admin);
      if (!role) {
        return res.status(403).json({ status: false, message: 'You are not authorized to remove this member' });
      }
  
      // Remove the member from the database
      await Member.findOneAndDelete({ id });
  
      return res.status(200).json({ status: true, message: 'Member removed successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}