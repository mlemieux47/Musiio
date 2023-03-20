require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const ConvertedFile = require('./models/convertedFile');

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

app.post('/upload', upload.single('audio'), (req, res) => {
    try {
        const file = req.file;
        // Handle the file upload here
        res.status(200).json({
            message: 'File uploaded successfully',
            file: {
                filename: file.filename,
                size: file.size,
                path: file.path
            }
        });
        
        ffmpeg(file.path)
            .audioFrequency(32000)
            .output('./converted.mp3')
            .on('end', () => {
                // Handle converted file here
                console.log('File conversion completed');

                // Read the converted file and save it to the database
                const convertedFilePath = './converted.mp3';
                fs.readFile(convertedFilePath, (err, data) => {
                    if (err) {
                        console.error(err);
                    } else {
                        // Save the converted file to the database
                        // const convertedFile = new ConvertedFile({
                        //     filename: file.filename,
                        //     size: data.length,
                        //     data: data
                        // });
                        // convertedFile.save();
                    }
                });
            })
            .run();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

app.use(express.json());
app.use(express.static('public'));

app.listen(3000, () => console.log('All Sytems Go on Port 3000'))
