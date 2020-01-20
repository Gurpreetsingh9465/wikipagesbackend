const debug = require('debug')('blogs:');
const express = require('express');
const router = express.Router();
const verifyToken = require('../../utils/verifyToken');
const Draft = require('../../models/Drafts')
const blogService = require('../service/blogs');
const limit = 5;

router.post('/draft', verifyToken, (req, res)=>{
    if(req.body.id === ':id') {
        const draft = new Draft({
            blog: req.body.blog,
            user: req._id,
            title: req.body.title
        });
        draft.save().then((savedDraft)=>{
            return res.status(200).json({id: savedDraft._id});
        }).catch((err)=>{
            return res.status(500).json({error: 'something went wrong'});
        });
    } else {
        Draft.findOneAndUpdate({_id: req.body.id},{
            blog: req.body.blog,
            user: req._id,
            title: req.body.title
        }).then((savedDraft)=>{
            return res.status(200).json({id: savedDraft._id});
        }).catch((err)=>{
            debug(err);
            return res.status(500).json({error: 'something went wrong'});
        });
    }
});

router.get('/draft', verifyToken, (req, res)=>{
    Draft.findById(req.query.id).then((draft)=>{
        if(draft.user._id.equals(req._id)) {
            return res.status(200).json({draft: draft});
        } else {
            return res.status(403).json({error: 'unauthorized'});
        }
    }).catch((err)=>{
        return res.status(500).json({error: 'something went wrong'});
    });
});

router.delete('/deleteDraft', verifyToken, (req, res)=>{
    Draft.findOneAndDelete({_id: req.query.id, user: req._id}).then(()=>{
        return res.status(200).json({});
    }).catch((err)=>{
        debug(err);
        return res.status(500).json({error: 'something went wrong'});
    });
});

router.get('/drafts', verifyToken, (req, res)=>{
    const skip = req.query.skip?Number(req.query.skip):0;
    Draft.find({user: req._id}).select({title: 1, updatedAt:1}).sort({'updatedAt':-1}).skip(skip).limit(limit).then((drafts)=>{
        return res.status(200).json({drafts: drafts});
    }).catch((err)=>{
        debug(err);
        return res.status(403).json({error: 'something went wrong'});
    })
})

module.exports = router;