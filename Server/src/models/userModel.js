import express from 'express';
import mongoose from 'mongoose';
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

export default mongoose.model('Users', userSchema);
