const debug = require('debug')('utils:');
const express = require('express');
const router = express.Router();
const verifyToken = require('../../utils/verifyToken');
const utilService = require('../service/utils');

router.post('/upload', verifyToken, (req, res) => {
    utilService.multerMiddleware(req, res, (err)=>{
        if(err) {
            return res.status(400).json({error: 'file size should be less than 2MB'});
        }
        if(req.file) {
            const [status, json] = utilService.upload(req.file.filename, req._id);
            return res.status(status).json(json);
        }
        return res.status(500).json({error:'something went wrong'});
    });
});

module.exports = router;