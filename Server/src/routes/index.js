import express from 'express';
import userRoutes from './users.js';
import postRoutes from './posts.js';

const AppRoute = (app) =>{
    app.use(express.json());
    app.use('/uploads', express.static('uploads'));
    app.use('/users', userRoutes);
    app.use('/posts', postRoutes);    
}


export default AppRoute;

