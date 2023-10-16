// check token from cookie and verify it and if it is a client then redirect to client route
const validateToken = require('../validators/validateToken');
function checkClientMiddleware(req, res, next){

    const token = req.cookies.authToken;
    if(!token) return res.status(401).json({ error: 'Access denied' });
    console.log('token exists');
    // verify token
    const decoded_user = validateToken(token);
    if(!decoded_user.success){
        return res.status(401).json({ error: 'Access denied' })
    }
    console.log('token is valid');
    const role = decoded_user.data.user.role.name;
    console.log(role)
    if(role !== 'client') {
        console.log('Access denied, forbidden');
        return res.status(403).json({ error: 'Access denied, forbidden' })
    }
    console.log('Access granted');
    next();

}

module.exports = checkClientMiddleware;