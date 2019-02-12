const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // check the incoming header to know if a user has authorization field
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    // if user doesnt exist it doesnt mean he has no proper token so take out the token
    const token = authHeader.split('')[1]; // Authorization: Bearer token
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let devodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesecretkey')
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    return next()
}