const e = require('express');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profile:{
        fullName: String,
        avatar: String,
        bio: String,
        birthday: Date,
        location: String
    }
});

module.exports = mongoose.model('Users', userSchema);
