import User from '../models/user.model.js';
import bcryptjs from  'bcryptjs';
import { errorHandler } from '../Utils/error.js'; 
import jwt from 'jsonwebtoken';
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Log the input values for debugging
    console.log('Received values:', username, email, password);

    // Check if all required fields are provided and not empty
    if (!username || !email || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, 'User already exists with this email'));
        }

        // Hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the user
        await newUser.save();

        // Respond with success
        res.json({ message: 'Signup successful' });
    } catch (error) {
        console.error("Error occurred saving user:", error);
        next(error);  // Pass the error to the error handling middleware
    }
};


export const signin =async(req,res,next)=>{
    // console.log(req.body);
    
    const{email,password}=req.body;  
    if(!email||!password||email===''||password===''){
       
        return next(errorHandler(400,'All fields are required'));
    }
    try{
        const validuser=await User.findOne({email});
        if(!validuser){
            
          return   next(errorHandler(400,'User not found'));
        }
        const validpassword=bcryptjs.compareSync(password,validuser.password);
        if(!validpassword){
            
          return   next(errorHandler(400,'Invalid password'));
        }
        const token=jwt.sign(
            {id:validuser.id,isAdmin:validuser.isAdmin}
             ,process.env.JWT_SECRET);
        
        const {password:pass,...rest}=validuser._doc;
        
        res.status(200).cookie('access_token',token,{
            httpOnly:true,
        }).json(rest);

    }catch(error){
        
        next(error);
    }
}
export const google =async (req,res,next)=>{
    const {email,name,googlePhtoUrl}=req.body;
    try{
        const user=await User.findOne({email});
        if(user){
            const token = jwt.sign(
            {id: user._id,isAdmin:user.isAdmin },process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res
            .status(200)
            .cookie('access_token', token, {
            httpOnly: true,
            })
        .json(rest);
        }else{
            const generatedPassword =
            Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
          const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
           const newUser = new User({
            username:
              name.toLowerCase().split(' ').join('') +
              Math.random().toString(9).slice(-4),
            email,
            password: hashedPassword,
            profilePicture: googlePhtoUrl,
          });
          await newUser.save();
          const token = jwt.sign(
            { id: newUser._id, isAdmin: newUser.isAdmin },
            process.env.JWT_SECRET
          );
          const { password, ...rest } = newUser._doc;
            res.status(200)
            .cookie('acces_token',token,{
                httpOnly:true,
            })
            .json(rest);
        }
    }catch(error){
        next(error);
    }
};