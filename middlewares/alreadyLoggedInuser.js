// stop user from accessing register page if they are already logged in
const validateToken = require("../validators/validateToken");
function alreadyLoggedInUser(req, res, next){
    console.log('alreadyLoggedInuser');
    const token =req.cookies.authToken;
    // validate token
    if(!token) return next();
    const decoded_user = validateToken(token);
    if(!decoded_user.success) return next();
    // if token is valid, redirect to home page
    return res.json({ error: 'You are already logged in' });
}

module.exports = alreadyLoggedInUser;