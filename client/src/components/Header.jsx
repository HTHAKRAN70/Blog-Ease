import {Avatar, Button,Dropdown,Navbar,TextInput} from 'flowbite-react';
import {AiOutlineSearch} from 'react-icons/ai';
import {Link,useLocation, useNavigate} from 'react-router-dom';
import {FaMoon, FaSun} from 'react-icons/fa'; 
import {useSelector,useDispatch } from 'react-redux';
import {toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect,useState } from 'react';

function Header() {
    const path=useLocation().pathname;
    const {currentUser}=useSelector(state=>state.user);
    const dispatch=useDispatch();
    const {theme} =useSelector((state)=>state.theme);
    const [searchterm,setsearchterm]=useState('');
    const location =useLocation().pathname;
    const navigate = useNavigate();
    useEffect(()=>{
      const urlParams=new URLSearchParams(location.search);
      const searchtermfromurl =urlParams.get('searchTerm');
      if(searchtermfromurl ){
        setsearchterm(searchtermfromurl);
      }

    },[location.search]);



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

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchterm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };


  return (
    <Navbar className="border-b-2">
        <Link to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='
        px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Blog</span>
        Ease
        </Link>
        <form  onSubmit={handleSubmit} >
            <TextInput
            type='text'
            rightIcon={AiOutlineSearch}
            placeholder='search...'
            className='hidden lg:inline'
            value={searchterm}
            onChange={(e)=>setsearchterm(e.target.value)}/>
        </form>
        <Button className='w-12 h-10 lg:hidden ' color='gray' pill>
            <AiOutlineSearch/>
        </Button>
        <div className='flex gap-2 md:order-2'>
            <Button className='w-12 h-12 hidden sm:inline'
            color='gray' 
            pill 
            onClick={()=>dispatch(toggleTheme())}>
              {
                theme==='dark'?(<FaMoon/>):(<FaSun/>)
              }
            
            </Button>
            {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handlesignout}>Signout</Dropdown.Item>
            </Dropdown>
        ) : (
          <Link to='/signin'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}
            
            <Navbar.Toggle/>

        </div>
        <Navbar.Collapse>
                <Navbar.Link active={path==='/'} as={'div'}>
                    <Link to='/'>
                    Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path==='/About'} as={'div'} >
                    <Link to='/About'>
                    About
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path==='/Projects'} as={'div'} >
                    <Link to='/Projects'>
                    Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>

    </Navbar>
  )
}

export default Header