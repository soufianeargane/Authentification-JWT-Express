
const validateToken = require('../validators/validateToken');
function checkClientMiddleware(req, res, next){
    console.log('checkClientMiddleware');
    console.log(req.user)
    const role = req.user.role.name;
    if(role !== 'client') {
        return res.status(403).json({ error: 'Access denied, forbidden, not ur role' })
    }
    next();

}

module.exports = checkClientMiddleware;