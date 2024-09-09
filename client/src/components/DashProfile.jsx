import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteuserSuccess,
  deleteuserFailure,
  deleteuserStart,
  signoutSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {HiOutlineExclamationCircle} from 'react-icons/hi'

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateuserSucess,setupdateuserSucess]=useState(null);
  const [updateusererror,setupdateusererror]=useState(null);
  const [showmodal,setshowmodal]=useState(false);

  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  console.log(currentUser);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log(currentUser);
    setupdateuserSucess(false);
    setupdateusererror(false);

    e.preventDefault();
    if(imageFileUploading){
      return ;
    }
    if (Object.keys(formData).length === 0) {
      setupdateusererror("user does not make any changes");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/Api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setupdateusererror(data.message);
      } else {
        dispatch(updateSuccess(data));
        setupdateuserSucess("users's profile updated succesfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setupdateusererror(error.message);
    }
  };
  

  const handledelete =async()=>{
    setshowmodal(false);
      try{
        dispatch(deleteuserStart());
        const res=await fetch(`/Api/user/delete/${currentUser._id}`,
          {
            method:'DELETE'
          }
        );
        const data=await res.json();
        if(!res.ok){
            dispatch(deleteuserSuccess(data.message));
        }else{
          dispatch(deleteuserFailure(data));
        }


      }catch(error){
        dispatch(deleteuserFailure(error.message));
      }
  };
  const handlesignout=async()=>{
      try{
        const res=await fetch('Api/user/signout',{
          method:'POST',
        });
        const data=await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
        }
      }catch(error){
        console.log(error);
      }

  }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? 'Loading...' : 'Update'}
        </Button>
        {
          currentUser.isAdmin&&(
            <Link to={'/createpost'}>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>

          )
        }
        {
          !currentUser.isAdmin&&(
            <Link to={'/adminauthorization'}>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
          )
        }
            
      </form>
      <div className='text-red-500 flex justify-between'>
          <span className='cursor-pointer' onClick={()=>setshowmodal(true)}>Delete Account</span>
          <span className='cursor-pointer' onClick={handlesignout}>Sign Out</span>
        </div>
        {updateuserSucess&&(
          <Alert color='success' className='mt-5'>
            {updateuserSucess}
          </Alert>
        )}
        {updateusererror&&(
          <Alert color='failure' className='mt-5'>
            {updateusererror}
          </Alert>
        )}
        {error&&(
          <Alert color='failure' className='mt-5'>
            {error}
          </Alert>
        )}
        <Modal
         show={showmodal}
         onClose={()=>{setshowmodal(false)}}
         popup
         size='md'
        >
          <Modal.Header/>
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='mx-auto mb-5 w-14 h-14 text-gray-400 dark:text-gray-200  '/>
              <h1 className='mb-5 text-lg text-gray-600 dark:text-gray-200 ' >Are you sure you want to delete your account permanently? </h1>

            </div>
            <div className='flex justify-center gap-5'>
              <Button color='failure' onClick={handledelete}>Yes, I'm sure</Button>
              <Button color='gray' onClick={()=>setshowmodal(false)}>Cancel</Button>
            </div>
          </Modal.Body>
        </Modal>
    </div>
  );
}