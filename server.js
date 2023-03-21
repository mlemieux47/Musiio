require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
//const convertedFilePath = './converted.mp3';

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

const ConvertedFile = require('./models/convertedFile');

const audioFilesRouter = require('./routes/audioFiles')
app.use('/audioFiles', audioFilesRouter)

app.use(express.static('public'));
app.use(express.json());

app.listen(3000, () => console.log('All Sytems Go on Port 3000'));