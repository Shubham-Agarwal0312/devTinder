const adminAuth = (req, res, next) => {
    const token = 'xdyz';
    const isAuthorizedUser = token === 'xyz';
    if (!isAuthorizedUser) {
        console.log('inside if condition');
        res.status(401).send('user not authorized');
    } else {
        console.log('inside else condition');
        next();
    }
}

const userAuth = (req, res, next) => {
    const token = 'xyz';
    const isAuthorizedUser = token === 'xyz';
    if (!isAuthorizedUser) {
        console.log('inside if condition');
        res.status(401).send('user not authorized');
    } else {
        console.log('inside else condition');
        next();
    }
}

module.exports = {adminAuth, userAuth};