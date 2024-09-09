import express from 'express';
import { verifyToken } from '../Utils/verifyuser.js';
import {create,getposts,deletepost,updatepost} from '../controler/post.controller.js';

const router = express.Router();
router.post('/create', verifyToken, create );
router.get('/getposts', getposts)
router.delete('/delete/:postId/:userId', verifyToken, deletepost)
router.put('/update/:postId/:userId',verifyToken,updatepost);
export default router; 
