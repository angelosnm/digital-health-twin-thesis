require('dotenv').config();
const mastodon = require("mastodon-api");
const express = require("express");
const patientRouter = express.Router()
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

const mastodonPost = require('../models/mastodonPost.model');

let authData = require('./authRoutes');
patientMastodon = authData.patientMastodon;

const fitbitClient = new FitbitApiClient({
    clientId: process.env.FITBIT_CLIENTID,
    clientSecret: process.env.FITBIT_CLIENT_SECRET,
    apiVersion: '1.2' // 1.2 is the default
});

function formatDate(date) {
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 101).toString().substring(1);
    let day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
}


patientRouter.get('/myposts', (req, res) => {
    patientMastodon.get('accounts/verify_credentials', (error, data) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log(data)

            let username = data.username;
            let totalPosts = data.statuses_count;
            let lastActive = data.last_status_at

            patientMastodon.get(`accounts/${data.id}/statuses`, (error, data) => {
                if (error) {
                    console.error(error);
                }
                else {
                    mastodonPost.find({ username }, (err, posts) => {
                        console.log(posts)
                        res.json(posts)
                    })
                }
            })
        }
    });
})

patientRouter.get('/mydevices', (req, res) => {
    patientMastodon.get('accounts/verify_credentials', (error, data) => {
        if (error) {
            console.error(error);
        }
        else {
            // console.log(data)
            let username = data.username;

            patientMastodon.get(`accounts/${data.id}/statuses`, (error, data) => {
                if (error) {
                    console.error(error);
                }
                else {
                    mastodonPost.find({ username }, (err, posts) => {
                        res.json(posts)
                    })
                }
            })

        }
    });
})

patientRouter.get("/mydevices/fitbit_auth", (req, res,) => {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(fitbitClient.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:5000/patient/mydevices/fitbit_cb'));
});

// handle the callback from the Fitbit authorization flow
patientRouter.get("/mydevices/fitbit_cb", (req, res) => {

    let callbackCode = req.query.code

    // exchange the authorization code we just received for an access token
    fitbitClient.getAccessToken(callbackCode, 'http://localhost:5000/patient/mydevices/fitbit_cb').then(auth => {

        let accessToken = auth.access_token
        let refreshToken = auth.refresh_token

        fitbitClient.get("/profile.json", auth.access_token).then(data => {

            console.log('User authorized')


            // defining every when the data will be gathered based on cron jobs 
            function fetchFitbitFlexData() {

                fitbitClient.refreshAccessToken(accessToken, refreshToken).then(auth => {

                    fitbitClient.get("/activities/date/" + formatDate(new Date()) + ".json", accessToken).then(data => {

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
                                console.log(`ID: ${post.id} and timestamp: ${post.created_at}`);
                                console.log(post.content);


                                mastodonPostDataSteps = {

                                    username: post.account.username,

                                    postData: {
                                        post_id: post.id,
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



                                let newMastodonPost = new mastodonPost(mastodonPostDataSteps);
                                newMastodonPost.save((err) => {
                                    if (err) {
                                        res.status(500).json(err)
                                    }
                                    else {
                                        console.log("Post saved to DB")
                                    }
                                })

                                mastodonPostDataCal = {

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

                                newMastodonPost = new mastodonPost(mastodonPostDataCal);
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
                }).catch(err => { res.status(err.status).send(err) });
            };

            setInterval(fetchFitbitFlexData, 60000)

        }).catch(err => { res.status(err.status).send(err) });
    }).catch(err => { res.status(err.status).send(err) });
});

patientRouter.get('/mydevices/bpmonitor', (req, res) => {

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
                        measuredUnit: "BPM"
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
                                console.log(`ID: ${post.id} and timestamp: ${post.created_at}`)
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
                                        device: 'Blood pressure monitor',
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
                                        // res.redirect('localhost:5000/device_added')
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



module.exports = patientRouter;