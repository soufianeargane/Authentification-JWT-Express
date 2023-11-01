const RoleModel = require('../models/RoleModel');

// get all roles
async function getAllRoles(req, res) {

    try {
        const roles = await RoleModel.find({ name: { $ne: "manager" } });
        res.status(200).json(roles);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

module.exports = {getAllRoles};