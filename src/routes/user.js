const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = 'firstName lastName age gender skills';

userRouter.get('/user/request/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const receiveRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate('fromUserId', USER_SAFE_DATA);

        res.send(receiveRequests);
    }
    catch (error) {
        res.send(400, 'Error: ' + error.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionList = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: 'accepted'},
                {toUserId: loggedInUser._id, status: 'accepted'}
            ]
        }).populate('fromUserId', USER_SAFE_DATA).populate('toUserId', USER_SAFE_DATA);

        const data = connectionList.map((connection) => {
            if (connection.fromUserId._id.equals(loggedInUser._id)) {
                return connection.toUserId;
            }
            return connection.fromUserId;
        })
        res.json({
            message: 'all connections',
            data
        });
    }
    catch (error) {
        res.send(400, 'Error : ' + error.message);
    }
});

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        let page = parseInt(req.query.page) || 1;
        page = page > 0 ? page : 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        limit = limit > 0 ? limit : 10;
        const skip = (page - 1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select('fromUserId toUserId status');
        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });
        hideUserFromFeed.add(loggedInUser._id.toString());
        const users = await User.find({
            _id: {$nin: Array.from(hideUserFromFeed)}
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.send(users);
    } 
    catch (error) {
        res.send(400, 'Error: ' + error.message);
    }
})

userRouter.get('/user', async (req, res) => {
    const userEmailId = req.body.emailId;
    try {
        const user = await User.find({emailId: userEmailId});
        if (user.length > 0) {
            res.send(user);
        } else {
            res.send('user not found');
        }
    } catch(err) {
        res.send(404, 'something went wrong');
    }
});

userRouter.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const doc = await User.findByIdAndDelete(userId);
        if (doc === null) {
            res.send('user not found');
        } else {
            res.send('User deleted successfully');
        }
        
    } catch(err) {
        res.send(404, 'Something went wrong');
    }
})

userRouter.patch('/user/:userId', async (req, res) => {
    // const userData = req.body;
    // const emailId = userData.emailId;
    // try {
    //     const ALLOWED_UPDATE = ['photoURL', 'about', 'skills', 'age', 'gender'];
    //     const isUpdateAllow = Object.keys(userData).every((k) => ALLOWED_UPDATE.includes(k));
    //     if (!isUpdateAllow) {
    //         throw new Error('Given fieldes not allowed to update');
    //     }
    //     const oldUser = await User.findOneAndUpdate({"emailId": emailId}, userData, {returnDocument: "before", runValidators: true});
    //     console.log('oldUser = ', oldUser);
    //     res.send('User updated successfully');
    // } catch(err) {
    //     res.status(400).send('Update Failed: ' + err.message);
    // }

    const userData = req.body;
    const userId = req.params?.userId;
    try {
        if (userId === null) {
            throw new Error('Please provide the user id');
        }
        const ALLOWED_UPDATE = ['photoURL', 'about', 'skills', 'age', 'gender'];
        const isUpdateAllow = Object.keys(userData).every((k) => ALLOWED_UPDATE.includes(k));
        if (!isUpdateAllow) {
            throw new Error('Given fieldes not allowed to update');
        }
        if (userData.skills.length > 0) {
            throw new Error('skills should not more than 10');
        }
        const oldUser = await User.findByIdAndUpdate(userId, userData, {returnDocument: "before"});
        console.log('oldUser = ', oldUser);
        res.send('User updated successfully');
    } catch(err) {
        res.status(400).send('Update Failed: ' + err.message);
    }
    
});

module.exports = userRouter;