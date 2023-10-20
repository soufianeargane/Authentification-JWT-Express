function managerMiddleware(req, res, next){
    console.log('managerMiddleware');
    const user = req.user;
    const role = user.user.role.name;
    if(role !== 'manager') {
        return res.status(403).json({ error: 'Access denied, forbidden, not ur role' })
    }
    next();
}

module.exports = managerMiddleware;