const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const { validateEditFields } = require('../utils/validate');
const validator = require('validator');
const bcrypt = require('bcrypt');


profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.send(404, 'Error: ' + err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        validateEditFields(req);
        const loggedInUser = req.user;
        const editFields = req.body;
        Object.keys(editFields).forEach((key) => loggedInUser[key] = editFields[key]);
        await loggedInUser.save();
        res.send(loggedInUser.firstName + ', Your profile updated successfully');
    }
    catch (error) {
        res.send(400, 'Error: ' + error.message);
    }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const { password } = req.body;
        if (!validator.isStrongPassword(password)) {
            throw new Error('password is not strong enough');
        }
        const newPasswordHash = await bcrypt.hash(password, 10);
        const user = req.user;
        user.password = newPasswordHash;
        await user.save();
        res.send('Password updated successfully');
    } 
    catch (error) {
        res.send(400, 'Error: ' + error.message);
    }
})

module.exports = profileRouter;