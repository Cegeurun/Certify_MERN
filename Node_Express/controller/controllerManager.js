import express from 'express';
import loginController from './loginController.js' 


// Controllers are responsible for the functions that need to run when a router maps to it.

const controller = express.Router();

loginController.use();

export default controller;