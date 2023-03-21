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
//function here for coversion 
//save file to database function 

app.post('/upload', upload.single('audio'), async (req, res) => {
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
  
      // Convert file here
      await new Promise((resolve, reject) => {
        ffmpeg(file.path)
          .audioFrequency(32000)
          .output('./converted.mp3')
          .on('end', () => {
            console.log('File conversion completed');
            resolve();
          })
          .on('error', (err) => {
            console.error(err);
            reject(err);
          })
          .run();
      });
  
      // Read the converted file and save it to the database
      const convertedFilePath = './converted.mp3';
      const data = await fs.promises.readFile(convertedFilePath);
      const convertedFile = new ConvertedFile({
        filename: `${file.filename}_converted.mp3`,
        size: data.length,
        path: convertedFilePath,
        convertedData: data,
        kHzRate: 32000,
      });
      await convertedFile.save();
      console.log('File saved to database');
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  });
  
  app.use(express.json());
  app.use(express.static('public'));
  
  app.listen(3000, () => console.log('All Sytems Go on Port 3000'));
