const express = require('express')
const userRouter = express.Router()
const passport = require('passport')
const passportConfig = require('../passport')

const User = require('../models/user.model');


userRouter.post('/register', (req, res) => {
    const { username, password, password_confirmation, email, mastodon_app_access_token } = req.body;
    User.findOne({ username }, (err, user) => {
        if (err) {
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
            return;
        }

        if (user) {
            res.status(400).json({ message: { msgBody: "Username already exists", msgError: true } });
            return;
        }

        if (!username || !password || !password_confirmation || !email || !mastodon_app_access_token) {
            res.status(400).json({ message: { msgBody: "Please enter all fields", msgError: true } });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ message: { msgBody: "Password must contain at least 8 characters", msgError: true } });
            return;
        }

        if (password !== password_confirmation) {
            res.status(400).json({ message: { msgBody: "Passwords are not mathcing", msgError: true } });
            return;
        }

        if (mastodon_app_access_token.length != 43 || /^\d+$/.test(mastodon_app_access_token) === true || /^[a-zA-Z]+$/.test(mastodon_app_access_token) === true || /^[^a-zA-Z0-9]+$/.test(mastodon_app_access_token) === true) { // if it is containing only numbers, characters or special characters
            res.status(400).json({ message: { msgBody: "Mastodon access token is invalid", msgError: true } });
            return;
        }


        const newUser = new User({ username, password, password_confirmation, email, mastodon_app_access_token });
        newUser.save(err => {
            if (err)
                res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
            else
                res.status(201).json({ message: { msgBody: "Account successfully created", msgError: false } });
        });
    });
});

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { username, email } = req.user;
    res.clearCookie('access_token');
    res.json({ user_details: { username, email }, logged_out: true });
});


userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { username, email } = req.user;
    res.status(200).json({ user_details: { username, email }, isAuthenticated: true });
});

module.exports = userRouter;