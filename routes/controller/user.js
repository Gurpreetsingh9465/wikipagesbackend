const debug = require('debug')('user:');
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const mongoErrCode = require('../../utils/MongoErr');
const verifyToken = require('../../utils/verifyToken');
const userService = require('../service/user');
const jwt = require('jsonwebtoken');

router.get('/user', verifyToken ,(req, res) => {
    User.findById(res.locals.id).then((user)=>{
        if(user) {
            return res.status(200).json({user: {...user}});
        }
        return res.status(404).json({user: null});
    }).catch((err)=>{
        return res.status(403).json({error: 'something went wrong'});
    })
});

router.post('/signup',(req,res) => {
    const user = new User({...req.body});
    user.password = user.encryptPassword(user.password);
    user.save().then((savedUser)=>{
        userService.sendConfirmationMail(savedUser._id, savedUser.email);
        return res.status(200).json({success: 'successfull'});
    }).catch((err)=>{
        if(err.name === 'MongoError' && err.code === mongoErrCode.duplicateEntry) {
            return res.status(400).json({error: 'email id already in use'});
        }
        return res.status(403).json({error: 'something went wrong'});
    })
});

router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}).then((user)=>{
        const [status, json] = userService.validateUser(user, req.body.password);
        if(status === 200) {
            const payload = { _id: user._id };
            const token = jwt.sign(payload, process.env.KEY);
            res.cookie('token', token, { httpOnly: true });
        }
        return res.status(status).json(json);
    }).catch((err)=>{
        return res.status(403).json({error: 'something went wrong'});
    });
});

router.get('/verify', verifyToken ,(req, res) => {
    User.findOneAndUpdate({_id: res.locals.id},{isVerified: true}).then((result)=>{
        return res.status(200).json({'msg': 'Account Verified'});
    }).catch((err)=>{
        return res.status(403).json({'msg': 'something went wrong'});
    })
});

router.post('/verificationmail',(req,res) => {
    User.findOne({email: req.body.email}).then((user)=>{
        if(user && user.isVerified) {
            return res.status(400).json({error: 'user already verified'});
        } else if(!user) {
            return res.status(404).json({error: 'user not found'});
        } else {
            userService.sendConfirmationMail(savedUser._id, savedUser.email);
            return res.status(200).json({success: 'successfull'});
        }
    }).catch((err)=>{
        return res.status(403).json({error: 'something went wrong'});
    });
});

module.exports = router;