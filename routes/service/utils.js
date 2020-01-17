const multer = require('multer');
const fs = require('fs');
const debug = require('debug')('utils:');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = process.env.IMAGE_DEST+'/'+req._id;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    },
    onError : function(err, next) {
        next(err);
    }
});

exports.multerMiddleware = multer({
    storage: storage,
    limits:{fileSize: 2097152},
}).single('file');

exports.upload = (filename,  _id) => {
    const url = process.env.SERVER_URL+"/"+_id+"/"+filename;
    return [200, {url: url}];
};
 