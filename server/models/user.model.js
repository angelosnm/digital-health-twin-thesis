const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    mastodon_app_access_token: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["doctor", "patient"],
        required: true
    },

    registration_date: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function (next) { //before save, hash the password. if it's already hashed, proceed
    if (!this.isModified('password'))
        return next();
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if (err)
            return next(err)

        this.password = passwordHash;
        next()
    });
})

userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err)
            return cb(err)
        else {
            if (!isMatch)
                return cb(null, isMatch)
            return cb(null, this)
        }
    })
}

const User = mongoose.model("User", userSchema);

module.exports = User;