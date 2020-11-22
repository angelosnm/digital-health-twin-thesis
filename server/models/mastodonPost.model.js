const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mastodonPostSchema = new Schema({

    username: String,

    postData: {
        post_id: String,
        code: String,
        subject: String,
        effective: String,
        issued: String,
        performer: String,
        value: Number,
        device: String,
        component: {
            code: String,
            value: String
        }
    }

});

const mastodonPost = mongoose.model("mastodonPost", mastodonPostSchema);

module.exports = mastodonPost;