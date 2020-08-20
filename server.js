if (process.env.NODE_ENV === 'dev') {
  require('dotenv').config()
}
const express = require('express')
const uploadSingleImage = require('./utils/upload')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

PORT = 3000

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})

// app.post('/upload', upload.array('photos', 3), function (req, res, next) {
// res.send('Successfully uploaded ' + req.files.length + ' files!')
// })

app.post('/upload', (req, res) => {
  uploadSingleImage(req, res, err => {
    if (err)
      return res.status(400).json({
        error: err,
      })
    if (!req.file)
      return res.status(400).json({ error: 'please provide a file' })
    res.json({
      msg: 'file uploaded',
      imgUrl: req.file.location,
    })
  })
})
