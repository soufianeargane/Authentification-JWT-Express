

const validateToken = require('../validators/validateToken');
function deliveryMiddleware(req, res, next){
    console.log('deliveryMiddleware');
    const user = req.user;
    const role = user.user.role.name;
    if(role !== 'delivery_men') {
        return res.status(403).json({ error: 'Access denied, forbidden, not ur role' })
    }
    next();

}

module.exports = deliveryMiddleware;