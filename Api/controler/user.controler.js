import { errorHandler } from "../Utils/error.js";
import user from '../models/user.model.js'
export const test =(req,res)=>{
    res.json({message:'API is working'});
};
export const updateuser= async(req,res,next)=>{
  console.log(req.user);
    if(req.user.id!=req.params.userId){
        return next(errorHandler(403,'You are not allowed to update this user'));
    } 
    if(req.body.password){
        if(req.body.password.length<6){
            return next(errorHandler(480,'Password must be at least 6 character'));
        }
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
          return next(
            errorHandler(400, 'Username must be between 7 and 20 characters')
          );
        }
        if (req.body.username.includes(' ')) {
          return next(errorHandler(400, 'Username cannot contain spaces'));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
          return next(errorHandler(400, 'Username must be lowercase'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
          return next(
            errorHandler(400, 'Username can only contain letters and numbers')
          );
        }}
        try{
            const updateuser=await user.findByIdAndUpdate(req.params.userId,
                {
                    $set:{
                       username:req.body.username,
                       email:req.body.email,
                       password:req.body.password,
                       profilePicture:req.body.profilePicture,
                    },
                },{new:true}
            );
            const {password, ...rest }=updateuser._doc;
            res.status(200).json(rest);
        }catch(err){
          
            next(err );
        }
};
export const getusers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await user.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await user.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await user.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteuser=async(req,res,next)=>{
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  try {
    await user.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};
export const signout =async(req,res,next)=>{
  try{
    res
    .clearCookie('access_token')
    .status(200)
    .json('User has been signed out');
  }
  catch(error){
    next(error);
  }
}
export const getUser = async (req, res, next) => {
  try {
    const users = await user.findById(req.params.userId);
    if (!users) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = users._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};