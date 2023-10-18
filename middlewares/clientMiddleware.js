
const validateToken = require('../validators/validateToken');
function checkClientMiddleware(req, res, next){
    console.log('checkClientMiddleware');
    const user = req.user;
    const role = user.user.role.name;
    if(role !== 'client') {
        return res.status(403).json({ error: 'Access denied, forbidden, not ur role' })
    }
    next();

}

module.exports = checkClientMiddleware;