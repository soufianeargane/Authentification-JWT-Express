
function getDeliveryMan(req, res){

    const deliveryMan = req.user;
    const name = deliveryMan.user.name;
    const role = deliveryMan.user.role.name;

    res.json({ success: `hello ${name}, your role is ${role}`})

}

module.exports = {
    getDeliveryMan
}