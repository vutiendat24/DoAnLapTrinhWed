const express = require('express');
const userRoutes = require('./users');
const postRoutes = require('./posts');

const AppRoute = (app) =>{
    app.use(express.json());
    app.use('/uploads', express.static('uploads'));
    app.use('/users', userRoutes);
    app.use('/posts', postRoutes);    
}

module.exports = AppRoute;

