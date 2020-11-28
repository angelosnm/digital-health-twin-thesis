const express = require('express')
const authRouter = express.Router()
const passport = require('passport')
const passportConfig = require('../passport')
const jwt = require('jsonwebtoken')
const mastodon = require("mastodon-api");

const User = require('../models/user.model');

// Authentication using jwt - issueing access token
const signToken = userID => {
    return jwt.sign({
        iss: "Digital Health Twin", // who issued the token
        sub: userID //for who this jwt has been assigned
    },
        process.env.jwtSecret,
        { expiresIn: 3600 });
}


authRouter.post('/register', (req, res) => {
    const { username, password, password_confirmation, email, mastodon_app_access_token, role } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err) {
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
            return;
        }

        if (user) {
            res.status(400).json({ message: { msgBody: "Username already exists", msgError: true } });
            return;
        }

        if (user) {
            res.status(400).json({ message: { msgBody: "Email address already exists", msgError: true } });
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


        const newUser = new User({ username, password, password_confirmation, email, mastodon_app_access_token, role });
        newUser.save(err => {
            if (err)
                res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
            else
                res.status(201).json({ message: { msgBody: "Account successfully created", msgError: false } });
        });
    });
});

authRouter.post('/login', passport.authenticate('local', { session: false },), (req, res) => {
    if (req.isAuthenticated()) {
        const { _id, username, email, mastodon_app_access_token, role } = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user: { username, email, role }, message: { msgBody: "Logged in", msgError: false }, access_token: token });

        // if logged in successfully, get Mastodon access token and initiate app

        if (role === "doctor") {
            doctorMastodon = new mastodon({
                access_token: mastodon_app_access_token,
                timeout_ms: 60 * 1000,
                api_url: process.env.MASTODON_INSTANCE,
            });

            exports.doctorMastodon = doctorMastodon;
        }
        if (role === "patient") {
            patientMastodon = new mastodon({
                access_token: mastodon_app_access_token,
                timeout_ms: 60 * 1000,
                api_url: process.env.MASTODON_INSTANCE,
            });

            exports.patientMastodon = patientMastodon;
        }
    }
    else {
        res.status(401).json({ isAuthenticated: false, message: { msgBody: "Wrong credentials", msgError: true } });
    }
});

authRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { username, email, role } = req.user;
    res.clearCookie('access_token');
    res.json({ user: { username, email, role }, logged_out: true });
});


authRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { username, email, role } = req.user;
    res.status(200).json({ user: { username, email, role }, isAuthenticated: true });
});

module.exports = authRouter;