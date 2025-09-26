const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:requestId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const status = req.params.status;
        const toUserId = req.params.requestId;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            throw new Error('Status is not valid');
        }

        const requestedUserExist = await User.findById(toUserId);
        if (!requestedUserExist) {
            throw new Error ('Requested user not found');
        }

        const existConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });
        if (existConnectionRequest) {
            throw new Error ("Request is already exist in DB");
        }

        const requestObj = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        await requestObj.save();

        res.json({
            message: req.user.firstName + " is " + status + " in " + requestedUserExist.firstName,
            data: requestObj
        });
    }
    catch (err) {
        res.send(404, 'Error: ' + err.message);
    }
});

module.exports = requestRouter;
