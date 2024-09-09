import { Sidebar } from 'flowbite-react';
import React,{useState,useEffect} from 'react'
import {HiUser,HiChartPie,HiAnnotation,HiArrowSmRight,HiDocumentText,HiOutlineUserGroup} from 'react-icons/hi';
import { useLocation,Link } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
function DashSidebar() {
  const location = useLocation();
  const dispatch=useDispatch();
  const {currentUser}=useSelector((state)=>state.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
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
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col '>
        {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to='/dashboard?tab=profile'>
          <Sidebar.Item active={tab==='profile'}
           icon={HiUser} 
           label={currentUser.isAdmin?('admin'):('user')} 
           labelColor='dark'
           as='div'
           >
            Profile
          </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item
                active={tab === 'posts'}
                icon={HiDocumentText}
                as='div'
              >
                Posts
              </Sidebar.Item>
            </Link>)}
            {currentUser.isAdmin && (
            <>
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                as='div'
              >
                Users
              </Sidebar.Item>
            </Link>
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item
                active={tab === 'comments'}
                icon={HiAnnotation}
                as='div'
              >
                Comments
              </Sidebar.Item>
            </Link>
          </>
              
          )
            
            }
          <Sidebar.Item  icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handlesignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar