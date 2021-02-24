require('dotenv').config();
const express = require("express");
const doctorRouter = express.Router()
const bodyParser = require('body-parser')
const moment = require('moment');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser())

const mastodonTootAlarm = require('../models/tootAlarm.model');
const mastodonToot = require('../models/toot.model');

let authData = require('./authRoutes');
doctorMastodon = authData.doctorMastodon

function alarmToot(content, id, username, measuredData, loincCode, measuredDataValue, device) {
  const params = {
    status: content
  }

  if (id) {
    params.in_reply_to_id = id;
  }

  doctorMastodon.post('statuses', params, (error, data) => {
    if (error) {
      console.error(error);
    }
    else {
      console.log(`ID:${data.id}and timestamp:${data.created_at} `);
      console.log(data.content);

      mastodonTootAlarmData = {

        username: data.account.username,

        tootData: {
          toot_id: data.id,
          replied_toot_id: params.in_reply_to_id,
          mastodon_user: username,
          measured_data: measuredData,
          loinc_code: loincCode,
          value: measuredDataValue,
          device: device,
          date: moment().utc().format("MM/DD/YYYY"),
          time: moment().utc().format("HH:mm"),
        }
      }


      let newMastodonPostAlarm = new mastodonTootAlarm(mastodonTootAlarmData);
      newMastodonPostAlarm.save((err) => {
        if (err) {
          res.status(500).json(err)
        }
        else {
          console.log("Alarm toot saved to DB")
        }
      })
    }
  })
}

// Doctor routes //



// Fetching patients list, following users from Mastodon
doctorRouter.get('/mypatients', (req, res) => {
  doctorMastodon.get('accounts/verify_credentials', (error, data) => {
    if (error) {
      console.error(error);
    }
    else {
      doctorMastodon.get('accounts/' + data.id + '/following', (error, data) => {
        if (error) {
          console.error(error);
        }
        else {
          res.json(data)
        }
      });
    }
  });
})

// Fetching a patient and his data

doctorRouter.get('/mypatients/:patient', (req, res) => {

  let patient = req.params.patient

  doctorMastodon.get('accounts/verify_credentials', (error, data) => {
    if (error) {
      console.error(error);
    }
    else {
      doctorMastodon.get('accounts/' + data.id + '/following', (error, data) => {
        if (error) {
          console.error(error);
        }
        else {
          mastodonToot.find({ username: patient }, (err, toots) => {
            res.json(toots)
          })
        }
      });
    }
  });
})


// Fetching alarms

doctorRouter.post('/alarming', (req, res) => {
  const { threshLowerDIAS, threshLowerSYS, threshLowerBPM, threshUpperDIAS, threshUpperSYS, threshUpperBPM } = req.body

  doctorMastodon.get('accounts/verify_credentials', (error, data) => {
    if (error) {
      console.error(error);
    }
    else {
      doctorMastodon.get('accounts/' + data.id + '/following', (error, data) => {
        if (error) {
          console.error(error);
        }
        else {
          const listener = doctorMastodon.stream(`streaming/user`)

          listener.on('message', msg => {

            if (msg.event === 'update') {
              mastodonToot.find((err, toots) => {

                let userToots = toots.filter(content => content.username === msg.data.account.username)


                let userTootsDIAS = userToots.filter(content => content.tootData.measured_data === "Diastolic Blood Pressure")
                let userTootsSYS = userToots.filter(content => content.tootData.measured_data === "Systolic Blood Pressure")
                let userTootsHeartrate = userToots.filter(content => content.tootData.measured_data === "Heart rate")

                let lowerDIASthreshold = parseInt(threshLowerDIAS)
                let upperDIASthreshold = parseInt(threshUpperDIAS)

                let lowerSYSthreshold = parseInt(threshLowerSYS)
                let upperSYSthreshold = parseInt(threshUpperSYS)

                let lowerHeartratethreshold = parseInt(threshLowerBPM)
                let upperHeartratethreshold = parseInt(threshUpperBPM)


                let replyToot;

                for (let i = 0; i < userTootsDIAS.length; i++) {
                  if (userTootsDIAS[i].tootData.value <= lowerDIASthreshold || userTootsDIAS[i].tootData.value >= upperDIASthreshold) {
                    replyToot = `Alarm triggered!\nuser: @${userTootsDIAS[i].username}\n` + userTootsDIAS[i].tootData.measured_data + ': ' + userTootsDIAS[i].tootData.value
                    alarmToot(replyToot, userTootsDIAS[i].tootData.id, userTootsDIAS[i].username, userTootsDIAS[i].tootData.measured_data, userTootsDIAS[i].tootData.loinc_code, userTootsDIAS[i].tootData.value, userTootsDIAS[i].tootData.device)
                  }
                }

                for (let i = 0; i < userTootsSYS.length; i++) {
                  if (userTootsSYS[i].tootData.value <= lowerSYSthreshold || userTootsSYS[i].tootData.value >= upperSYSthreshold) {
                    replyToot = `Alarm triggered!\nuser: @${userTootsSYS[i].username}\n` + userTootsSYS[i].tootData.measured_data + ': ' + userTootsSYS[i].tootData.value
                    alarmToot(replyToot, userTootsSYS[i].tootData.id, userTootsSYS[i].username, userTootsSYS[i].tootData.measured_data, userTootsSYS[i].tootData.loinc_code, userTootsSYS[i].tootData.value, userTootsSYS[i].tootData.device)
                  }
                }

                for (let i = 0; i < userTootsHeartrate.length; i++) {
                  if (userTootsHeartrate[i].tootData.value <= lowerHeartratethreshold || userTootsHeartrate[i].tootData.value >= upperHeartratethreshold) {
                    replyToot = `Alarm triggered!\nuser: @${userTootsHeartrate[i].username}\n` + userTootsHeartrate[i].tootData.measured_data + ': ' + userTootsHeartrate[i].tootData.value
                    alarmToot(replyToot, userTootsHeartrate[i].tootData.id, userTootsHeartrate[i].username, userTootsHeartrate[i].tootData.measured_data, userTootsHeartrate[i].tootData.loinc_code, userTootsHeartrate[i].tootData.value, userTootsHeartrate[i].tootData.device)
                  }
                }

              })
                .catch(function (error) {
                  console.log(error);
                })
            }
          })
          listener.on('error', err => console.log(err))
        }
      });
    }
  });
})

doctorRouter.get('/myalarms', (req, res) => {
  doctorMastodon.get('accounts/verify_credentials', (error, data) => {
    if (error) {
      console.error(error);
    }
    else {
      let username = data.username;

      mastodonTootAlarm.find({ username }, (err, toots) => {
        res.json(toots)
      })
    }
  });
})

doctorRouter.get('/stop_data', (req, res) => {

  res.redirect("http://localhost:5000/myalarms")
  process.exit(1)
})

module.exports = doctorRouter;