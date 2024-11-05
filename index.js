const express = require('express');
const cors = require('cors');
const multer = require('multer')
const path = require('path')
require('dotenv').config()

const app = express();

// Configure storage engine and filename
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

// Initialize upload middleware and add file size limit
const upload = multer({
  storage: storage,
}).single('upfile')

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Set POST route for file upload
app.post('/api/fileanalyse', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      console.error(err)
      return res.status(500).json({error: err})
    }
    if(!req.file){
      return res.status(400).json({error: 'Please send file'})
    }
    
    const uploadedFile = req.file
    const filename = uploadedFile.originalname
    const filesize_bytes = uploadedFile.size
    const mimetype = uploadedFile.mimetype

    console.log(req.file)
    res.json({
      name: filename,
      type: mimetype,
      size: filesize_bytes
    })
  })
})



const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
