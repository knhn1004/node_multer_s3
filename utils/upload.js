const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path')

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_ID,
  region: process.env.AWS_REGION,
})

const s3 = new aws.S3()

const uploadSingleImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    // acl: 'public-read',
    metadata: function (_, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (_, file, cb) {
      cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`)
    },
  }),
  fileFilter: (_, file, cb) => {
    checkFileType(file, cb)
  },
}).single('file')

// check file type
function checkFileType(file, cb) {
  // allowed ext
  const filetypes = /jpeg|jpg|png|gif/
  // check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // check mimetype
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Error: file type not supported')
  }
}

module.exports = uploadSingleImage
