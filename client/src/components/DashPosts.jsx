import React, { useState, useEffect } from 'react';
import { Table } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import {HiOutlineExclamationCircle} from 'react-icons/hi'

function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserposts] = useState([]);
    const [showMore, setshowMore] = useState(true);
    const [showmodal,setshowmodal]=useState(false);
    const [postid,setpostid]=useState('');

    useEffect(() => {
        const fetchposts = async () => {
            try {
                const res = await fetch(`Api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    setUserposts(data.posts);
                    if (data.posts.length < 9) {
                        setshowMore(false);
                    }
                    // console.log(data.Posts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchposts();
            
        }
    }, [currentUser]);

    const handleshowmore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`Api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUserposts((prev) => ([...prev, ...data.Posts]));
                if (data.Posts.length < 9) {
                    setshowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const handledelete = async()=>{
      setshowmodal(false);
      try{
        const res = await fetch(`/Api/post/delete/${postid}/${currentUser._id}`, {
          method: 'DELETE',
      });
      
        // const res=await fetch(`/Api/post/delete?/${postid}/${currentUser._id}`);
        const data=await res.json();
        if(!res.ok){
          
          console.log(data.message);
        }else{
          setUserposts((prev)=>
          prev.filter((post)=>post._id!==postid));
        }
      }catch(error){
        console.log(currentUser._id);
        console.log(postid)
        console.log(error);
      }
    }


    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body className='divide-y'>
                            {userPosts.map((post) => (
                                <Table.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(post.updatedAt).toDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img src={post.image}
                                                alt={post.title}
                                                className='w-20 h-10 object-cover bg-gray-500' />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className='font-medium text-gray-900 dark:text-white'
                                            to={`/post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                            onClick={
                                              ()=>{
                                                setshowmodal(true);
                                                setpostid(post._id);
                                              }
                                          }
                                            
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className='text-teal-500 hover:underline'
                                            to={`/update-post/${post._id}`}
                                        >
                                            <span>Edit</span>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {showMore && (
                        <button onClick={handleshowmore} className='w-full text-teal-500 self-center py-1'>
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <span>There are no posts</span>
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

export default DashPosts;
