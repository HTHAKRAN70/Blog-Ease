import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import About from './pages/About';
import DashBoard from './pages/DashBoard';
import Pages from './pages/Pages';
import Projects from './pages/Projects';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn'
import Home from './pages/Home';
import Header from './Components/Header';
import PrivateRoute from './Components/PrivateRoute';
import OnlyPrivateRoute from './Components/OnlyPrivateRoute'
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePosts';
import PostPage from './pages/PostPage';
import Search from './pages/Search';
import Payment from './pages/Payment.jsx';
import ScrolltoTop from './components/ScrolltoTop';
function App() {
  return (
     <BrowserRouter>
        <ScrolltoTop/>
         <Header/>
        <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/About' element={<About/>}></Route>
            <Route path='/Pages' element={<Pages/>}></Route>
            <Route path='/Projects' element={<Projects/>}></Route>
            <Route path='/SignIn' element={<SignIn/>}></Route>
           <Route path='/SignUp' element={<SignUp/>}></Route>
           <Route path='/search' element={<Search/>}></Route>
            <Route element={<PrivateRoute/>}>
            <Route path='/dashBoard' element={<DashBoard/>}></Route>
            </Route>
            <Route element={<OnlyPrivateRoute/>}>
            <Route path='/createPost' element={<CreatePost/>}></Route>
            <Route path='/adminauthorization' element={<Payment/>}></Route>
            <Route path='/update-post/:postId' element={<UpdatePost/>}></Route>
            </Route>
            <Route path='/post/:postSlug' element={<PostPage/>}></Route>


            </Routes>
     </BrowserRouter>
  )
}

export default App