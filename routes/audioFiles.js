//const { request, response } = require('express')
const express = require ('express')
const router = express.Router()
const ConvertedFile = require('../models/convertedFile')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');


//Getting all uploaded files
router.get('/', async (request, response) => {
    try {
        const convertedFiles = await ConvertedFile.find()
        response.json(convertedFiles)
    } catch (error) {
        response.status(500).json({ message: err.message})
        
    }

})
//Getting one file
router.get('/:id', (request, response) => {
    response.send(request.params.id)
})
// Uplooading Mulitpule 
router.post('/upload', upload.array('audio'), async (req, res) => {
    try {
      const files = req.files;
      // Handle the file upload here
      res.status(200).json({
        message: 'Files uploaded successfully',
        files: files.map((file) => ({
          filename: file.filename,
          size: file.size,
          path: file.path,
        })),
      });
  
      // Convert files here
      for (const file of files) {
        const convertedFilePath = `./${file.filename}_converted.mp3`;
        await new Promise((resolve, reject) => {
          ffmpeg(file.path)
            .audioFrequency(32000)
            .output(convertedFilePath)
            .on('end', () => {
              console.log(`File conversion completed for ${file.filename}`);
              resolve();
            })
            .on('error', (err) => {
              console.error(err);
              reject(err);
            })
            .run();
        });
  
        // Read the converted file and save it to the database
        const data = await fs.promises.readFile(convertedFilePath);
        const convertedFile = new ConvertedFile({
          filename: `${file.filename}_converted.mp3`,
          size: data.length,
          path: convertedFilePath,
          convertedData: data,
          kHzRate: 32000,
        });
        await convertedFile.save();
        console.log(`File ${file.filename} saved to database`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  });

//Uploading and Converting SINGLE File 
// router.post('/upload', upload.single('audio'), async (req, res) => {
//         try {
//           const file = req.file;
//           // Handle the file upload here
//           res.status(200).json({
//             message: 'File uploaded successfully',
//             file: {
//               filename: file.filename,
//               size: file.size,
//               path: file.path
//             }
//           });
      
//     // Convert file here
//           await new Promise((resolve, reject) => {
//             ffmpeg(file.path)
//               .audioFrequency(32000)
//               .output('./converted.mp3')
//               .on('end', () => {
//                 console.log('File conversion completed');
//                 resolve();
//               })
//               .on('error', (err) => {
//                 console.error(err);
//                 reject(err);
//               })
//               .run();
//           });
      
//     // Read the converted file and save it to the database
//           const convertedFilePath = './converted.mp3';
//           const data = await fs.promises.readFile(convertedFilePath);
//           const convertedFile = new ConvertedFile({
//             filename: `${file.filename}_converted.mp3`,
//             size: data.length,
//             path: convertedFilePath,
//             convertedData: data,
//             kHzRate: 32000,
//           });
//           await convertedFile.save();
//           console.log('File saved to database');
//         } catch (error) {
//           console.error(error);
//           res.status(500).json({
//             message: 'Internal server error'
//           });
//         }
//       });

//updating one

router.patch('/:id', (request, response) => {
    
})

//Deleting one 
router.delete('/:id', (request, response) => {
    
})


module.exports = router