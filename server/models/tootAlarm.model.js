const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tootAlarmSchema = new Schema({

    username: String,

    tootData: {
        toot_id: String,
        replied_post_id: String,
        mastodon_user: String,
        measured_data: String,
        loinc_code: String,
        value: Number,
        device: String,
        date: String,
        time: String,
    }

});

const tootAlarm = mongoose.model("tootAlarm", tootAlarmSchema);

module.exports = tootAlarm;