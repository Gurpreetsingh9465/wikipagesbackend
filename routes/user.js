const debug = require('debug')('user:');
const express = require('express');
const router = express.Router();

router.get('/test',(req,res)=>{
    res.json({'msg': 'working user'}).status(200);
});

module.exports = router;