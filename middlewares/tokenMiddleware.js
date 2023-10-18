const validateToken = require('../validators/validateToken');
function checkTokenMiddleware(req, res, next){
    console.log('checkTokenMiddleware');
    const token = req.params.token || req.cookies.authToken;
    if(!token) return res.status(401).json({ error: 'Access denied' });
    console.log('token exists 1');
    // verify token
    const decoded_user = validateToken(token);
    if(!decoded_user.success){
        return res.status(401).json({ error: 'Access denied' })
    }
    console.log('token is valid 2');
    req.user = decoded_user.data;
    next();

}

module.exports = checkTokenMiddleware;