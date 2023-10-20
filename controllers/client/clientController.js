const validateToken = require("../../validators/validateToken");

function getClient(req, res){
    //get token from cookie
    const token = req.cookies.authToken;
    const decoded_user = validateToken(token);
    const role = decoded_user.data.user.role.name;
    const name = decoded_user.data.user.name;
    res.json({ success: `hello ${name}, your role is ${role}`})
}

module.exports = {
    getClient
}