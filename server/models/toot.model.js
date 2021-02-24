const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tootSchema = new Schema({

    username: String,

    tootData: {
        toot_id: String,
        mastodon_user: String,
        measured_data: String,
        loinc_code: String,
        value: Number,
        device: String,
        date: String,
        time: String,
    }
});

const toot = mongoose.model("toot", tootSchema);

module.exports = toot;