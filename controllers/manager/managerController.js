
function getManager(req, res){

    const manager = req.user;
    const name = manager.user.name;
    const role = manager.user.role.name;

    res.json({ success: `hello ${name}, your role is ${role}`})

}

module.exports = {
    getManager
}