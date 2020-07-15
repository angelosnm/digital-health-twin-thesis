require('dotenv').config();
const mastodon = require("mastodon-api");
const express = require("express");
const doctorRouter = express.Router()
const bodyParser = require('body-parser')
const FitbitApiClient = require("fitbit-node");
const schedule = require('node-schedule');
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

const mastodonPostAlarm = require('../models/mastodonPostAlarm.model');

let serverData = require('../server');
doctorMastodon = serverData.doctorMastodon

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

        postData: {
          post_id: data.id,
          replied_post_id: params.in_reply_to_id,
          user: username,
          date: moment().utc().format("MM/DD/YYYY"),
          issued: moment().utc().format("HH:mm"),
          performer: data.account.username,
          value: measuredDataValue,
          device: ' ',
          component: {
            code: loincCode,
            value: measuredData
          }
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
      doctorMastodon.get('accounts/' + data.id + '/following', (error, data) => {
        if (error) {
          console.error(error);
        }
        else {
          res.json(data)
          console.log(data)
        }
      });
    }
  });
})

// Fetching a patient and his/her data

doctorRouter.get('/mypatients/:patient', (req, res) => {

  let patient = req.params.patient

  doctorMastodon.get('accounts/verify_credentials', (error, data) => {
    if (error) {
      console.error(error);
    }
    else {
      doctorMastodon.get('accounts/' + data["id"] + '/following', (error, data) => {
        if (error) {
          console.error(error);
        }
        else {
          for (let i = 0; i < data.map(user => user.username).length; i++) {
            if (patient === data.map(user => user.username)[i]) {
              doctorMastodon.get('accounts/' + data.map(user => user.id)[i] + '/statuses', (error, data) => {
                if (error) {
                  console.error(error);
                  res.send("user does not exist")
                }
                else {
                  axios.get(process.env.DB_ENDPOINT_MASTODONPOSTS)
                    .then(function (response) {
                      if (patient === response.data.map(posts => posts.username)[0]) {
                        console.log(response.data)
                        res.json(response.data)
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                    })
                }
              });
            }
          }
        }
      });
    }
  });
})


// Fetching alarms

doctorRouter.get('/alarming', (req, res) => {
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
              axios.get(process.env.DB_ENDPOINT_MASTODONPOSTS)
                .then(function (response) {

                  let userPosts = response.data.filter(content => content.username === msg.data.account.username)

                  let userPostsDIAS = userPosts.filter(content => content.postData.component.value === "BP dias")
                  let userPostsSYS = userPosts.filter(content => content.postData.component.value === "BP sys")
                  let userPostsHeartrate = userPosts.filter(content => content.postData.component.value === "Heart rate")

                  let upperDIASthreshold = 120
                  let lowerDIASthreshold = 80

                  let upperSYSthreshold = 120
                  let lowerSYSthreshold = 80

                  let upperHeartratethreshold = 100
                  let lowerHeartratethreshold = 60

                  let replyToot;

                  for (let i = 0; i < userPostsDIAS.length; i++) {
                    if (userPostsDIAS[i].postData.value.$numberInt <= lowerDIASthreshold || userPostsDIAS[i].postData.value.$numberInt >= upperDIASthreshold) {
                      replyToot = `Alarm triggered!\nuser: @${userPostsDIAS[i].username}\n` + userPostsDIAS[i].postData.component.value + ': ' + userPostsDIAS[i].postData.value.$numberInt
                      alarmToot(replyToot, userPostsDIAS[i].postData.id, userPostsDIAS[i].username, userPostsDIAS[i].postData.component.value, userPostsDIAS[i].postData.component.code, userPostsDIAS[i].postData.value.$numberInt)
                    }
                  }

                  for (let i = 0; i < userPostsSYS.length; i++) {
                    if (userPostsSYS[i].postData.value.$numberInt <= lowerSYSthreshold || userPostsSYS[i].postData.value.$numberInt >= upperSYSthreshold) {
                      replyToot = `Alarm triggered!\nuser: @${userPostsSYS[i].username}\n` + userPostsSYS[i].postData.component.value + ': ' + userPostsSYS[i].postData.value.$numberInt
                      alarmToot(replyToot, userPostsSYS[i].postData.id, userPostsSYS[i].username, userPostsSYS[i].postData.component.value, userPostsSYS[i].postData.component.code, userPostsSYS[i].postData.value.$numberInt)
                    }
                  }

                  for (let i = 0; i < userPostsHeartrate.length; i++) {
                    if (userPostsHeartrate[i].postData.value.$numberInt <= lowerHeartratethreshold || userPostsHeartrate[i].postData.value.$numberInt >= upperHeartratethreshold) {
                      replyToot = `Alarm triggered!\nuser: @${userPostsHeartrate[i].username}\n` + userPostsHeartrate[i].postData.component.value + ': ' + userPostsHeartrate[i].postData.value.$numberInt
                      alarmToot(replyToot, userPostsHeartrate[i].postData.id, userPostsHeartrate[i].username, userPostsHeartrate[i].postData.component.value, userPostsHeartrate[i].postData.component.code, userPostsHeartrate[i].postData.value.$numberInt)
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
      axios.get(process.env.DB_ENDPOINT_MASTODONPOSTSALARMS)
        .then(function (response) {
          console.log(response.data.map(data => data.postData.value))
          res.json(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  });
})

module.exports = doctorRouter;