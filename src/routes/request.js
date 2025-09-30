const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const status = req.params.status;
        const toUserId = req.params.userId;

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

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            throw new Error('status is not valid');
        }
        const requestExist = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser,
            status: 'interested',
        });
        if(!requestExist) {
            throw new Error ('request not exist');
        }
        requestExist.status = status;
        await requestExist.save();

        res.json({message: loggedInUser.firstName + " " + status + " the connection request",
            requestExist
        });
    }
    catch (error) {
        res.send(400, 'Error: ' + error.message);
    }
})

module.exports = requestRouter;
