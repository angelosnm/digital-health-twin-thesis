const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mastodonPostAlarmSchema = new Schema({

    username: String,

    postData: {
        post_id: String,
        replied_post_id: String,
        user: String,
        date: String,
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

const mastodonPostAlarm = mongoose.model("mastodonPostAlarm", mastodonPostAlarmSchema);

module.exports = mastodonPostAlarm;