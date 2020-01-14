const debug = require('debug')('user:');
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const mongoErrCode = require('../../utils/MongoErr');
const sendMail = require('../../utils/sendMail');

router.post('/signup',(req,res) => {
    const user = new User({...req.body});
    user.password = user.encryptPassword(user.password);
    user.save().then(()=>{
        return res.status(200).json({success: 'successfull'});
    }).catch((err)=>{
        if(err.name === 'MongoError' && err.code === mongoErrCode.duplicateEntry) {
            return res.status(400).json({error: 'email id already in use'});
        }
        return res.status(403).json({error: 'something went wrong'}, 403);
    })
});

// router.post('/login', (req, res) => {

// });

router.get('/testmail', (req, res) => {
    sendMail('amansingh9569@gmail.com','test','test');
    return res.send('done');
});

module.exports = router;