import express from 'express';
import { signup } from '../controler/auth.controller.js';
import { signin } from '../controler/auth.controller.js';
import { google } from '../controler/auth.controller.js';
const router=express.Router();
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google);
export default router; 