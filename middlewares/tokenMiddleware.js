const validateToken = require('../validators/validateToken');
function checkTokenMiddleware(req, res, next){
    console.log('checkTokenMiddleware');
    const token = req.cookies.authToken;
    if(!token) return res.status(401).json({ error: 'Access denied, you need to log in hhh' });
    console.log('token exists');
    // verify token
    const decoded_user = validateToken(token);
    if(!decoded_user.success){
        return res.status(401).json({ error: 'Access denied' })
    }
    req.user = decoded_user.data.user;
    next();

}

module.exports = checkTokenMiddleware;