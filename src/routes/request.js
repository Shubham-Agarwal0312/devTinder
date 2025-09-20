const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');

requestRouter.get('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user.firstName + ' send connection Request');
    }
    catch (err) {
        res.send(404, 'Error: ' + err.message);
    }
});

module.exports = requestRouter;
