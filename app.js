require('dotenv').config();
const mastodon = require("mastodon-api");
const express = require("express");
const route = require('express').Router();
const app = express();
const FitbitApiClient = require("fitbit-node");
const schedule = require('node-schedule');
const moment = require('moment');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios').default;
const path = require('path')
const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');

app.use(cors());
app.use(express.json());

const uri = process.env.DB_CONNECTION

mongoose
  .connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected!'))
  .catch(err => console.log(err));

let mastodonPost = require('./models/mastodonPost.model');
let mastodonPostAlarm = require('./models/mastodonPostAlarm.model');

console.log("Digital Health Twin")

// Fetching Mastodon instance API for a patient
const patientMastodon = new mastodon({
  access_token: process.env.MASTODON_ACCESS_TOKEN,
  timeout_ms: 60 * 1000,
  api_url: process.env.MASTODON_INSTANCE,
});

const doctorMastodon = new mastodon({
  access_token: process.env.MASTODON_ACCESS_TOKEN_DOC,
  timeout_ms: 60 * 1000,
  api_url: process.env.MASTODON_INSTANCE,
});

const client = new FitbitApiClient({
  clientId: process.env.FITBIT_CLIENTID,
  clientSecret: process.env.FITBIT_CLIENT_SECRET,
  apiVersion: '1.2' // 1.2 is the default
});


// Function to get current date in order to be used for fetching data from Fitbit API
function formatDate(date) {
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 101).toString().substring(1);
  let day = (date.getDate() + 100).toString().substring(1);
  return year + "-" + month + "-" + day;
}


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

// ROUTES

app.get('/', (req, res) => {
  res.send("hi there")
})

app.get("/user/authorize", (req, res, ) => {
  // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
  res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:5000/user/callback'));
});

// handle the callback from the Fitbit authorization flow
app.get("/user/callback", (req, res) => {

  let callbackCode = req.query.code

  // exchange the authorization code we just received for an access token
  client.getAccessToken(callbackCode, 'http://localhost:5000/user/callback').then(auth => {

    let accessToken = auth.access_token
    let refreshToken = auth.refresh_token

    client.get("/profile.json", accessToken).then(data => {

      let userData = {
        fullName: data[0]["user"]["fullName"],
        age: data[0]["user"]["age"],
        birthDate: data[0]["user"]["dateOfBirth"],
        height: data[0]["user"]["height"],
        weight: data[0]["user"]["weight"],
        memberSince: data[0]["user"]["memberSince"],
        userAvatar: data[0]["user"]["avatar150"]
      }

      res.redirect('http://localhost:3000/')
      console.log('User authorized')


      // defining every when the data will be gathered based on cron jobs 
      schedule.scheduleJob('*/1 * * * *', function fetchFitbitData() {

        client.refreshAccessToken(accessToken, refreshToken).then(auth => {

          client.get("/activities/date/" + formatDate(new Date()) + ".json", accessToken).then(data => {

            let fetchedData = {
              calories: data[0]["summary"]["calories"]["total"],
              steps: data[0]["summary"]["steps"],
              distance: data[0]["summary"]["distance"] + " Km",
              currentTime: moment().utc().format("HH:mm"),
              currentDate: moment().utc().format("MM/DD/YYYY"),
            }


            let loincTable = {
              steps: {
                code: "55423-8",
                name: "Steps"
              },
              calories: {
                code: "41981-2",
                name: "Calories burned"
              },
              device: 'Fitbit Flex'
            }


            const params = {
              status: `${loincTable.device}\n\n` +
                "Total calories burned: " +
                fetchedData.calories + "\n" +
                "Total steps measured: " +
                fetchedData.steps + "\n" +
                "Date: " +
                fetchedData.currentDate + "\n" +
                "Issued at: " +
                fetchedData.currentTime + "\n"
            }

            patientMastodon.post('statuses', params, (error, post) => {
              if (error) {
                console.error(error);
              }
              else {
                console.log(`ID: ${post["id"]} and timestamp: ${post.created_at}`);
                console.log(post.content);


                mastodonPostData = {

                  username: post.account.username,

                  post: {
                    code: loincTable.steps.code,
                    subject: post.account.username,
                    effective: fetchedData.currentDate,
                    issued: fetchedData.currentTime,
                    perfomer: "Digital Health Twin",
                    value: fetchedData.steps,
                    device: loincTable.device,
                    component: {
                      code: loincTable.steps.code,
                      value: loincTable.steps.name
                    }
                  }
                }



                let newMastodonPost = new mastodonPost(mastodonPostData);
                newMastodonPost.save((err) => {
                  if (err) {
                    res.status(500).json(err)
                  }
                  else {
                    console.log("Post saved to DB")
                  }
                })

                mastodonPostData = {

                  username: post.account.username,

                  postData: {
                    post_id: post.id,
                    code: loincTable.calories.code,
                    subject: post.account.username,
                    effective: fetchedData.currentDate,
                    issued: fetchedData.currentTime,
                    perfomer: "Digital Health Twin",
                    value: fetchedData.calories,
                    device: loincTable.device,
                    component: {
                      code: loincTable.calories.code,
                      value: loincTable.calories.name
                    }
                  }
                }

                newMastodonPost = new mastodonPost(mastodonPostData);
                newMastodonPost.save((err) => {
                  if (err) {
                    res.status(500).json(err)
                  }
                  else {
                    console.log("Post saved to DB")
                  }
                })

              }
            });
          }).catch(err => { res.status(err.status).send(err) });
        });
      });
    }).catch(err => { res.status(err.status).send(err) });
  }).catch(err => { res.status(err.status).send(err) });
});

app.get('/user/heartrate', (req, res) => {

  const directoryPath = path.join(__dirname, '/');


  readXlsxFile('data/Copy of Blood pressure data.xlsx').then((rows) => {

    for (let i = 1; i < rows.length; i++) {

      rows[i][0] = moment().utc().add(i * 60000, 'milliseconds').format() //date

      function fetchHeartrateData() {

        let postDetails = {
          SYS: {
            value: rows[i][1],
            LoincID: "8480-6",
            loincShortName: "BP sys",
            measuredUnit: "mm[Hg]"
          },
          DIA: {
            value: rows[i][2],
            LoincID: "8462-4",
            loincShortName: "BP dias",
            measuredUnit: "mm[Hg]"
          },
          BPM: {
            value: rows[i][3],
            LoincID: "8867-4",
            loincShortName: "Heart rate",
            measuredUnit: "bpm"
          }
        }

        if (rows[i][0] === moment().utc().format()) {

          for (let j = 0; j < Object.keys(postDetails).length; j++) {

            const params = {
              status:
                "Measured data: " +
                postDetails[Object.keys(postDetails)[j]].loincShortName + "\n" +
                "Value: " +
                postDetails[Object.keys(postDetails)[j]].value + "\n" +
                "Date: " +
                moment().utc().format("MM/DD/YYYY") + "\n" +
                "Issued at: " +
                moment().utc().format("HH:mm") + "\n"
            }

            patientMastodon.post('statuses', params, (error, post) => {
              if (error) {
                console.error(error);
              }
              else {
                console.log(`ID: ${post["id"]} and timestamp: ${post.created_at}`);
                console.log(post.content);

                mastodonPostData = {

                  username: post.account.username,

                  postData: {
                    post_id: post.id,
                    code: postDetails[Object.keys(postDetails)[j]].LoincID,
                    subject: post.account.username,
                    effective: moment().utc().format("MM/DD/YYYY"),
                    issued: moment().utc().format("HH:mm"),
                    perfomer: "Digital Health Twin",
                    value: postDetails[Object.keys(postDetails)[j]].value,
                    device: ' ',
                    component: {
                      code: postDetails[Object.keys(postDetails)[j]].LoincID,
                      value: postDetails[Object.keys(postDetails)[j]].loincShortName
                    }
                  }
                }


                let newMastodonPost = new mastodonPost(mastodonPostData);
                newMastodonPost.save((err) => {
                  if (err) {
                    res.status(500).json(err)
                  }
                  else {
                    console.log("Post saved to DB")
                  }
                })
              }
            })
          }
        }
      }
      setInterval(fetchHeartrateData, 60000);
    }
  })
})

app.get('/mypatients', (req, res) => {
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
          res.json(data)
          console.log(data)
        }
      });
    }
  });
})

app.get('/mypatients/:patient', (req, res) => {

  let patient = req.params["patient"]

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

app.get('/user/myalarms', (req, res) => {
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
                      alarmToot(replyToot, userPostsSYS[i].postData.id, userPostsSYS[i].postData.component.value, userPostsSYS[i].postData.component.code, userPostsSYS[i].postData.value.$numberInt)
                    }
                  }

                  for (let i = 0; i < userPostsHeartrate.length; i++) {
                    if (userPostsHeartrate[i].postData.value.$numberInt <= lowerHeartratethreshold || userPostsHeartrate[i].postData.value.$numberInt >= upperHeartratethreshold) {
                      replyToot = `Alarm triggered!\nuser: @${userPostsHeartrate[i].username}\n` + userPostsHeartrate[i].postData.component.value + ': ' + userPostsHeartrate[i].postData.value.$numberInt
                      alarmToot(replyToot, userPostsHeartrate[i].postData.id, userPostsHeartrate[i].postData.component.value, userPostsHeartrate[i].postData.component.code, userPostsHeartrate[i].postData.value.$numberInt)
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

app.get('/myalarms', (req, res) => {
  doctorMastodon.get('accounts/verify_credentials', (error, data) => {
    if (error) {
      console.error(error);
    }
    else {
      axios.get(process.env.DB_ENDPOINT_MASTODONPOSTSALARMS)
        .then(function (response) {
          console.log(response.data)
          res.json(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  });
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});