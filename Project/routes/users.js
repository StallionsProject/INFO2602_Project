const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');


router.put('/register', (req, res, next) => {
    let newUser = new User ({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        description: req.body.description,
        following:req.body.following,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err) {
            res.json({success: false, msg: 'Failed to register user'});
        } else {
            res.json({success: true, msg: 'User registered'});
        }
    });
});

router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 604800 // 1 week i think
                });
                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        description: user.description,
                        following: user.following,
                        email: user.email
                    }
                })
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
});


router.post('/update', passport.authenticate('jwt', {session:false}), (req, res, next) => {

    let jsonStr = JSON.parse(req.body.user);
    // console.log(jsonStr);
    const id = jsonStr.id;
    // console.log('ID: ', id);
    const description = req.body.description;
    console.log(req.body.description);

    User.updateUserById(id, description, (err, id) => {
        if(err) {
            res.json({success: false, msg: 'Failed to update user description'});
        } else {
            res.json({success: true, msg: 'User description updated'});
        }
    });
});

router.post('/following', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    const userId = req.body.id;
    const following = req.body.following;

    User.updateUserFollowingById(userId, following, (err, id) => {
        if (err) {
            res.json({success: false, msg: 'Failed to add following'});
        }
        User.getUserById(userId, (err, user) => {
            if (err) throw err;
            if (!user) {
                return res.json({success: false, msg: 'User not found'});
            }
            // console.log(user);
            return res.json({
                success: true,
                msg: 'User following updated',
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    description: user.description,
                    following: user.following,
                    email: user.email
                }
            });
        });
    });
});


router.delete('/remove-user/:userId', (req, res, next) => {
    console.log(req.params.userId);
    const id = req.params.userId;

    User.deleteUser(id, (err) => {
        if(err) {
            res.json({success: false, msg: 'Failed to delete'});
        } else {
            res.json({success: true, msg: 'User deleted'});
        }
    });
});

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

router.get('/following', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({following: req.user.following});
});

router.get('/users-info/:skip', (req, res, next) => {
    const skip = req.params.skip;
    User.getUsers( skip,(err, users) => {
        if(err) {
            res.json({success: false, msg: 'Failed to get users'});
        }
        if(!users) {
            return res.json({success: false, msg: 'User not found'});
        } else {
            res.json({success: true, users: users, msg: 'User got'});
        }
    });
});


module.exports = router;


