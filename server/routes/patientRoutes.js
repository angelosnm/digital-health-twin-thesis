require('dotenv').config();
const express = require("express");
const patientRouter = express.Router()
const bodyParser = require('body-parser')
const FitbitApiClient = require("fitbit-node");
const moment = require('moment');
const cors = require('cors');
const path = require('path')
const readXlsxFile = require('read-excel-file/node');
const cookieParser = require('cookie-parser')

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser())

const toot = require('../models/toot.model');

let authData = require('./authRoutes');
patientMastodon = authData.patientMastodon;

tootPostInterval = 5000

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

const fetchApiInterval = 10000


patientRouter.get('/mytoots', (req, res) => {
    patientMastodon.get('accounts/verify_credentials', (error, data) => {
        if (error) {
            console.error(error);
        }
        else {
            let username = data.username;

            patientMastodon.get(`accounts/${data.id}/statuses`, (error, data) => {
                if (error) {
                    console.error(error);
                }
                else {
                    toot.find({ username }, (err, toots) => {
                        res.json(toots)
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
            let username = data.username;

            patientMastodon.get(`accounts/${data.id}/statuses`, (error, data) => {
                if (error) {
                    console.error(error);
                }
                else {
                    toot.find({ username }, (err, toots) => {
                        res.json(toots)
                    })
                }
            })

        }
    });
})

patientRouter.get("/mydevices/fitbit_auth", (req, res,) => {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(fitbitClient.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:5000/auth/patient/mydevices/fitbit_cb'));
});

// handle the callback from the Fitbit authorization flow
patientRouter.get("/mydevices/fitbit_cb", (req, res) => {

    let callbackCode = req.query.code

    // exchange the authorization code we just received for an access token
    fitbitClient.getAccessToken(callbackCode, 'http://localhost:5000/auth/patient/mydevices/fitbit_cb').then(auth => {

        let accessToken = auth.access_token
        let refreshToken = auth.refresh_token

        fitbitClient.get("/profile.json", auth.access_token).then(data => {

            res.redirect('http://localhost:5000/device_added')

            console.log('User authorized from Fitbit')


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
                                fetchedData.currentTime + " (UTC)"
                        }

                        patientMastodon.post('statuses', params, (error, post) => {
                            if (error) {
                                console.error(error);
                            }
                            else {
                                console.log(`ID: ${post.id} and timestamp: ${post.created_at}`);
                                console.log(post.content);


                                tootDataSteps = {

                                    username: post.account.username,

                                    tootData: {
                                        toot_id: post.id,
                                        mastodon_user: post.account.username,
                                        measured_data: loincTable.steps.name,
                                        loinc_code: loincTable.steps.code,
                                        value: fetchedData.steps,
                                        device: loincTable.device,
                                        date: fetchedData.currentDate,
                                        time: fetchedData.currentTime,
                                    }
                                }


                                let newToot = new toot(tootDataSteps);
                                newToot.save((err) => {
                                    if (err) {
                                        res.status(500).json(err)
                                    }
                                    else {
                                        console.log("Toot saved to DB")
                                    }
                                })

                                tootDataCal = {

                                    username: post.account.username,

                                    tootData: {
                                        toot_id: post.id,
                                        mastodon_user: post.account.username,
                                        measured_data: loincTable.calories.name,
                                        loinc_code: loincTable.calories.code,
                                        value: fetchedData.calories,
                                        device: loincTable.device,
                                        date: fetchedData.currentDate,
                                        time: fetchedData.currentTime,
                                    }
                                }

                                newToot = new toot(tootDataCal);
                                newToot.save((err) => {
                                    if (err) {
                                        res.status(500).json(err)
                                    }
                                    else {
                                        console.log("Toot saved to DB")
                                    }
                                })

                            }
                        });
                    }).catch(err => { res.status(err.status).send(err) });
                }).catch(err => { res.status(err.status).send(err) });
            };

            setInterval(fetchFitbitFlexData, fetchApiInterval)

        }).catch(err => { res.status(err.status).send(err) });
    }).catch(err => { res.status(err.status).send(err) });
});

patientRouter.get('/mydevices/bpmonitor', (req, res) => {

    const directoryPath = path.join(__dirname, '/');


    readXlsxFile('../thesis_docs/tempFiles/dummyData//Copy of Blood pressure data.xlsx').then((rows) => {

        for (let i = 1; i < rows.length; i++) {

            rows[i][0] = moment().utc().add(i * tootPostInterval, 'milliseconds').format() //date

            function fetchHeartrateData() {

                let tootDetails = {
                    SYS: {
                        value: rows[i][1],
                        LoincID: "8480-6",
                        loincShortName: "Systolic Blood Pressure",
                        measuredUnit: "mm[Hg]"
                    },
                    DIA: {
                        value: rows[i][2],
                        LoincID: "8462-4",
                        loincShortName: "Diastolic Blood Pressure",
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

                    for (let j = 0; j < Object.keys(tootDetails).length; j++) {

                        const params = {
                            status:
                                "Measured data: " +
                                tootDetails[Object.keys(tootDetails)[j]].loincShortName + "\n" +
                                "Value: " +
                                tootDetails[Object.keys(tootDetails)[j]].value + " " + tootDetails[Object.keys(tootDetails)[j]].measuredUnit + "\n" +
                                "Date: " +
                                moment().utc().format("MM/DD/YYYY") + "\n" +
                                "Issued at: " +
                                moment().utc().format("HH:mm") + " (UTC)"
                        }

                        patientMastodon.post('statuses', params, (error, post) => {
                            if (error) {
                                console.error(error);
                            }
                            else {
                                console.log(`ID: ${post.id} and timestamp: ${post.created_at}`)

                                tootData = {

                                    username: post.account.username,

                                    tootData: {
                                        toot_id: post.id,
                                        mastodon_user: post.account.username,
                                        measured_data: tootDetails[Object.keys(tootDetails)[j]].loincShortName,
                                        loinc_code: tootDetails[Object.keys(tootDetails)[j]].LoincID,
                                        value: tootDetails[Object.keys(tootDetails)[j]].value,
                                        device: "Blood Pressure Monitor",
                                        date: moment().utc().format("MM/DD/YYYY"),
                                        time: moment().utc().format("HH:mm"),
                                    }
                                }


                                let newtoot = new toot(tootData);
                                newtoot.save((err) => {
                                    if (err) {
                                        res.status(500).json(err)
                                    }
                                    else {
                                        console.log("Toot saved to db")
                                    }
                                })
                            }
                        })
                    }
                }
            }
            setInterval(fetchHeartrateData, tootPostInterval);
        }
    })

    res.redirect('http://localhost:5000/device_added')
})

patientRouter.get('/mydevices/scale', (req, res) => {

    const directoryPath = path.join(__dirname, '/');

    readXlsxFile('../thesis_docs/tempFiles/dummyData//WithingsScale_data.xlsx').then((rows) => {

        for (let i = 1; i < rows.length; i++) {

            rows[i][0] = moment().utc().add(i * tootPostInterval, 'milliseconds').format() //date

            function fetchWeightData() {

                let tootDetails = {
                    WGHT: {
                        value: rows[i][1],
                        LoincID: "29463-7",
                        loincShortName: "Weight",
                        measuredUnit: "Kg"
                    },
                    FatPer: {
                        value: rows[i][2],
                        LoincID: "41982-0",
                        loincShortName: "Fat Percentage",
                        measuredUnit: "%"
                    },
                    FatMass: {
                        value: rows[i][3],
                        LoincID: "73708-0",
                        loincShortName: "Fat Mass",
                        measuredUnit: "Kg"
                    }
                }

                if (rows[i][0] === moment().utc().format()) {

                    for (let j = 0; j < Object.keys(tootDetails).length; j++) {

                        const params = {
                            status:
                                "Measured data: " +
                                tootDetails[Object.keys(tootDetails)[j]].loincShortName + "\n" +
                                "Value: " +
                                tootDetails[Object.keys(tootDetails)[j]].value + " " + tootDetails[Object.keys(tootDetails)[j]].measuredUnit + "\n" +
                                "Date: " +
                                moment().utc().format("MM/DD/YYYY") + "\n" +
                                "Issued at: " +
                                moment().utc().format("HH:mm") + " (UTC)"
                        }

                        patientMastodon.post('statuses', params, (error, post) => {
                            if (error) {
                                console.error(error);
                            }
                            else {
                                console.log(`ID: ${post.id} and timestamp: ${post.created_at}`)

                                tootData = {

                                    username: post.account.username,

                                    tootData: {
                                        toot_id: post.id,
                                        mastodon_user: post.account.username,
                                        measured_data: tootDetails[Object.keys(tootDetails)[j]].loincShortName,
                                        loinc_code: tootDetails[Object.keys(tootDetails)[j]].LoincID,
                                        value: tootDetails[Object.keys(tootDetails)[j]].value,
                                        device: "Scale",
                                        date: moment().utc().format("MM/DD/YYYY"),
                                        time: moment().utc().format("HH:mm"),
                                    }
                                }


                                let newtoot = new toot(tootData);
                                newtoot.save((err) => {
                                    if (err) {
                                        res.status(500).json(err)
                                    }
                                    else {
                                        console.log("Toot saved to db")
                                    }
                                })
                            }
                        })
                    }
                }
            }
            setInterval(fetchWeightData, tootPostInterval);
        }
    })

    res.redirect('http://localhost:5000/device_added')
})

patientRouter.get('/stop_data', (req, res) => {

    res.redirect("http://localhost:5000/mydevices")
    process.exit(1)
})



module.exports = patientRouter;