import express from 'express';
import { test,updateuser,deleteuser,signout,getusers,getUser } from '../controler/user.controler.js';
import { verifyToken } from '../Utils/verifyuser.js';

const router = express.Router();
router.get('/test',test);
router.put('/update/:userId',verifyToken,updateuser);
router.delete('/delete/:userId',verifyToken,deleteuser);
router.post('/signout',signout);
router.get('/getusers',verifyToken,getusers);
router.get('/:userId',getUser);
export default router; 