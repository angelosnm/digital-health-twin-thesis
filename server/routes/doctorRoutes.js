require('dotenv').config();
const mastodon = require("mastodon-api");
const express = require("express");
const doctorRouter = express.Router()
const bodyParser = require('body-parser')
const FitbitApiClient = require("fitbit-node");
const moment = require('moment');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios').default;
const path = require('path')
const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');
const session = require('express-session')
const cookieParser = require('cookie-parser')

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser())

const mastodonPostAlarm = require('../models/tootAlarm.model');
const mastodonPost = require('../models/toot.model');

let authData = require('./authRoutes');
doctorMastodon = authData.doctorMastodon

function alarmToot(content, id, username, measuredData, loincCode, measuredDataValue) {
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

      mastodonPostAlarmData = {

        username: data.account.username,

        tootData: {
          post_id: data.id,
          replied_post_id: params.in_reply_to_id,
          mastodon_user: username,
          measured_data: measuredData,
          loinc_code: loincCode,
          value: measuredDataValue,
          device: ' ',
          date: moment().utc().format("MM/DD/YYYY"),
          time: moment().utc().format("HH:mm"),
          performer: data.account.username,
        }
      }


      let newMastodonPostAlarm = new mastodonPostAlarm(mastodonPostAlarmData);
      newMastodonPostAlarm.save((err) => {
        if (err) {
          res.status(500).json(err)
        }
        else {
          console.log("Alarm post saved to DB")
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
      console.log(data)
      doctorMastodon.get('accounts/' + data.id + '/following', (error, data) => {
        if (error) {
          console.error(error);
        }
        else {
          console.log(data)
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
          mastodonPost.find({ username: patient }, (err, posts) => {
            res.json(posts)
          })
        }
      });
    }
  });
})


// Fetching alarms

doctorRouter.post('/alarming', (req, res) => {
  const { threshLowerDIAS, threshLowerSYS, threshLowerBPM, threshUpperSYS, threshUpperDIAS, threshUpperBPM } = req.body
  console.log(req.body)
  console.log(threshLowerDIAS)

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
              mastodonPost.find((err, posts) => {
                // console.log(posts)

                let userPosts = posts.filter(content => content.username === msg.data.account.username)

                // console.log(userPosts)

                let userPostsDIAS = userPosts.filter(content => content.tootData.measured_data === "BP dias")
                let userPostsSYS = userPosts.filter(content => content.tootData.measured_data === "BP sys")
                let userPostsHeartrate = userPosts.filter(content => content.tootData.measured_data === "Heart rate")

                let lowerDIASthreshold = parseInt(threshLowerDIAS)
                let upperDIASthreshold = parseInt(threshUpperDIAS)

                let lowerSYSthreshold = parseInt(threshLowerSYS)
                let upperSYSthreshold = parseInt(threshUpperSYS)

                let lowerHeartratethreshold = parseInt(threshLowerBPM)
                let upperHeartratethreshold = parseInt(threshUpperBPM)


                let replyToot;

                for (let i = 0; i < userPostsDIAS.length; i++) {
                  if (userPostsDIAS[i].tootData.value <= lowerDIASthreshold || userPostsDIAS[i].tootData.value >= upperDIASthreshold) {
                    replyToot = `Alarm triggered!\nuser: @${userPostsDIAS[i].username}\n` + userPostsDIAS[i].tootData.measured_data + ': ' + userPostsDIAS[i].tootData.value
                    alarmToot(replyToot, userPostsDIAS[i].tootData.id, userPostsDIAS[i].username, userPostsDIAS[i].tootData.measured_data, userPostsDIAS[i].tootData.loinc_code, userPostsDIAS[i].tootData.value)
                  }
                }

                for (let i = 0; i < userPostsSYS.length; i++) {
                  if (userPostsSYS[i].tootData.value <= lowerSYSthreshold || userPostsSYS[i].tootData.value >= upperSYSthreshold) {
                    replyToot = `Alarm triggered!\nuser: @${userPostsSYS[i].username}\n` + userPostsSYS[i].tootData.measured_data + ': ' + userPostsSYS[i].tootData.value
                    alarmToot(replyToot, userPostsSYS[i].tootData.id, userPostsSYS[i].username, userPostsSYS[i].tootData.measured_data, userPostsSYS[i].tootData.loinc_code, userPostsSYS[i].tootData.value)
                  }
                }

                for (let i = 0; i < userPostsHeartrate.length; i++) {
                  if (userPostsHeartrate[i].tootData.value <= lowerHeartratethreshold || userPostsHeartrate[i].tootData.value >= upperHeartratethreshold) {
                    replyToot = `Alarm triggered!\nuser: @${userPostsHeartrate[i].username}\n` + userPostsHeartrate[i].tootData.measured_data + ': ' + userPostsHeartrate[i].tootData.value
                    alarmToot(replyToot, userPostsHeartrate[i].tootData.id, userPostsHeartrate[i].username, userPostsHeartrate[i].tootData.measured_data, userPostsHeartrate[i].tootData.loinc_code, userPostsHeartrate[i].tootData.value)
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

      mastodonPostAlarm.find({ username }, (err, posts) => {
        res.json(posts)
      })
    }
  });
})

module.exports = doctorRouter;