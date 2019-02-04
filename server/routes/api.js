const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Resource = require('../models/resource')
const mongoose = require('mongoose')

const router = express.Router()

const db = "mongodb://chainstack:chainstack1@ds111425.mlab.com:11425/chanstacktestdb"

mongoose.connect(db, { useNewUrlParser: true }, err => {
    if(err) {
        console.error('Error!' + err)
    } else {
        console.log('Connected to mongodb')
        
    }
})

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
        return res.status(401).send('Unauthorized request')
    }
    
    req.userId = payload.subject
    req.origUsername = payload.username
    next()
}

function verifyAdmin(req, res, next) {
    if(req.origUsername === 'admin') {
        next()
    } else {
        return res.status(401).send('Unauthorized request')
    }
}

router.get('/', (req, res) => {
    res.send('From API route')
})

router.post('/adduser', verifyToken, (req, res) => {
    let userData = req.body
    let user = new User(userData)
    user.save((error, registeredUser) => {
        if(error) {
            if(error.code === 11000) {
                res.status(401).send('User already exists')
            } else {
                console.log(error)
            }
        } else {
            res.status(200).send(registeredUser)
        }
    })
})

router.post('/deluser', verifyToken, verifyAdmin, (req, res) => {

    Resource.deleteMany({email: req.body.email}).exec(function (err) {
        if(err) {
            console.log(err)
        } else {
            User.findOne({email: req.body.email}).deleteOne().exec(function (err) {
                if(err) {
                    console.log(err)
                } else {
                    res.status(200).send({})
                }
            });
        }
    });
    
}) 

router.get('/users', verifyToken, verifyAdmin, (req, res) => {
    User.find({email: { $ne: "admin" }}).lean().exec(function (err, users) {
        res.json(users)
    })
}) 


router.post('/login', (req, res) => {
    let userData = req.body

    User.findOne({email: userData.email}, (err, user) => {
        if(err) {
            console.log(error)
        } else {
            if(!user) {
                res.status(401).send('Invalid email')
            } else {
                if(user.password != userData.password) {
                    res.status(401).send('Invalid password')
                } else {
                    let payload = {subject: user._id, username: userData.email }
                    let token = jwt.sign(payload, 'secretKey')
                    res.status(200).send({token, "admin": userData.email == "admin"})
                }
            }
        }
    })
})

router.get('/resources', verifyToken, (req, res) => {
    
    let email = req.query.email || req.origUsername;
    
    if(req.origUsername !== 'admin' && email != req.origUsername) {
        res.status(401).send('Unauthorized request');
        return;
    }

    Resource.find({email: email}).lean().exec(function (err, users) {
        res.json(users)
    })
}) 

router.post('/resourceadd', verifyToken, async (req, res) => {

    let email = req.body.email || req.origUsername;
    if(req.origUsername !== 'admin' && email != req.origUsername) {
        res.status(401).send('Unauthorized request');
        return;
    }

    console.log()

    let resource = new Resource({email: email, value: req.body.value})

    const result = await User.findOne({email: email}).exec();
    const quota = result.quota;

    const count = await Resource.countDocuments({email: email}).exec();

    if(count >= quota) {
        res.status(402).send('Quota exceeded')
        return;
    } 

    resource.save((err, registeredUser) => {
        if(err) {
            console.log(err)
        } else {
            res.status(200).send({})
        }
    })
})

router.post('/resourcedel', verifyToken, (req, res) => {

    let email = req.body.email || req.origUsername;
    if(req.origUsername !== 'admin' && email != req.origUsername) {
        res.status(401).send('Unauthorized request');
        return;
    }

    Resource.findOne({email: email, value: req.body.value}).deleteOne().exec(function (err) {
        if(err) {
            console.log(err)
        } else {
            res.status(200).send({})
        }
    });
})

router.post('/quota', verifyToken, verifyAdmin, (req, res) => {

    let email = req.body.email;
    let quota = req.body.quota;

    User.updateOne({ email: email}, {quota: quota}, function(err, raw) {
        if(err) {
            console.log(err)
        } else {
            res.status(200).send({})
        }
    })
})

module.exports = router