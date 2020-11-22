require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser())

console.log("Digital Health Twin")

const authRouter = require('./routes/authRoutes')
app.use('/auth', authRouter);

const doctorRouter = require('./routes/doctorRoutes')
app.use('/user', doctorRouter);

const patientRouter = require('./routes/patientRoutes')
app.use('/patient', patientRouter);

const uri = process.env.DB_CONNECTION
mongoose
  .connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }) 
  .then(() => console.log('Successfully connected to database'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});