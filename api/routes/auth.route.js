import express from 'express';
import {google, signin, signup, signOut , Facebook}   from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.post('/facebook', Facebook);
router.get('/signout', signOut);

export default router;