const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const UserSchema = mongoose.Schema ({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    following: {
        type: Object,
    },
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.updateUserById = function(id, description, callback) {
    User.update(
        {_id: id},
        {
            $set: {description: description}
        },
        callback
    );
};

module.exports.updateUserFollowingById = function(id, following, callback) {
    User.update(
        {_id: id},
        {
            $set: {following: following}
        },
        callback
    );
};

module.exports.getUserByUsername = function(username, callback) {
    const query = {username: username};
    User.findOne(query, callback);
};

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.deleteUser = function(id, callback) {
    User.deleteOne({_id: id}, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};

module.exports.getUsers = function(skip, callback) {
    User.count({}, function (err, count) {
        User.find({}, ['name', 'description'], {skip: parseInt(skip), limit: count}, callback);
    });

};
