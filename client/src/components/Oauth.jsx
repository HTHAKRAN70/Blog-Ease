import { GoogleAuthProvider,signInWithPopup,getAuth } from 'firebase/auth'
import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle, } from 'react-icons/ai'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInsuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
function Oauth() {
  const auth=getAuth(app);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const handlegoogleclick=async()=>{
    const provider=new GoogleAuthProvider();
    provider.setCustomParameters({prompt:'select_account'})
    try{
      const resultfromgoogle=await signInWithPopup(auth,provider);
      const res =await fetch('/Api/auth/google',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name:resultfromgoogle.user.displayName,
          email:resultfromgoogle.user.email,
          googlePhotoUrl:resultfromgoogle.user.photoURL,
        }),
      })
      const data=await res.json();
      if(res.ok){
        dispatch(signInsuccess(data));
        navigate('/');
      }
    }catch(error){
      console.log(error);
    }
  }
  return (
    <Button type='button ' gradientDuoTone='pinkToOrange' outline
    onClick={handlegoogleclick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
      Continue with Google
    </Button>
  )
}
export default Oauth