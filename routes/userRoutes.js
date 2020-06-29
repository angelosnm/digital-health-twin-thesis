const express = require('express')
const userRouter = express.Router()
const passport = require('passport')
const passportConfig = require('../passport')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model');

const signToken = userID => {
    return jwt.sign({
        iss: "Digital Health Twin", // who issued the token
        sub: userID //for who this jwt has been assigned
    },
        process.env.jwtSecret,
        { expiresIn: 3600 });
}



userRouter.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    User.findOne({ username }, (err, user) => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        if (user)
            res.status(400).json({ message: { msgBody: "Username already exists", msgError: true } });
        else {
            const newUser = new User({ username, password, email });
            newUser.save(err => {
                if (err)
                    res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
                else
                    res.status(201).json({ message: { msgBody: "Account successfully created", msgError: false } });
            });
        }
    });
});

userRouter.post('/login', passport.authenticate('local', { session: false },), (req, res) => {
    if (req.isAuthenticated()) {
        const { _id, username, email } = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user_details: { username, email }, message: { msgBody: "Logged in", msgError: false }, access_token: token });
    }
    else {
        res.status(401).json({ isAuthenticated: false, message: { msgBody: "Wrong credentials", msgError: true } });
    }
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