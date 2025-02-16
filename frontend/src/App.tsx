import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux/store';
import { addUser, removeUser } from "@/redux/features/userSlice";
import { useEffect, useState } from 'react';
import api from './lib/axios';
// import { ThemeProvider } from "@/components/theme-provider"
// import HomePage from './pages/HomePage';
import Login from './pages/LoginPage';
// import SignUp from './pages/SignUp';
import { LoaderCircle } from 'lucide-react';
import HomePage from './pages/HomePage';
import GroupsPage from './pages/GroupsPage';
import CreateGroupsPage from './pages/CreateGroupsPage';
import Navbar from './components/Navbar';
import SignUp from './pages/SignUp';
import ViewGroupPage from './pages/ViewGroupPage';
import JoinGroupPage from './pages/JoinGroupPage';
// import { SharedDataProvider } from './components/SharedDataProvider';

type userType = {
  email: string,
  token: string
}

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);
  const [isUserChecked, setIsUserChecked] = useState(false);
  // const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get("/api/user/session");
        console.log('test', response);
        const user: userType = { token: response.data.token, email: response.data.email };
        dispatch(addUser(user)); // Update Redux with user data
      } catch (error) {
        console.error("No active session or invalid token");
        dispatch(removeUser());
      } finally {
        setIsUserChecked(true);
      }
    };
    checkSession();
  }, [dispatch]);


  if (!isUserChecked) {
    return <div className="flex justify-center items-center h-screen">
      <LoaderCircle className="animate-spin pr-2" />
      Loading...
    </div>;
  }

  return (
    <Router>
        <div className="min-h-screen h-fit bg-gray-100">
          <Navbar />
          {/* <Navbar /> */}
          <Routes>
            <Route path='/login' element={!user ? <Login /> : <Navigate to='/home' />} />
            <Route path='/' element={!user ? <Login /> : <Navigate to='/home' />} />
            <Route path='/signup' element={!user ? <SignUp /> : <Navigate to='/home' />} />
            <Route path='/home' element={user ? <HomePage /> : <Navigate to='/login' />} />
            <Route path='/groups' element={user ? <GroupsPage /> : <Navigate to='/login' />} />
            <Route path='/create-group' element={user ? <CreateGroupsPage /> : <Navigate to='/login' />} />
            <Route path='/groups/:userId/:groupId' element={user ? <ViewGroupPage /> : <Navigate to='/login' />} />
            <Route path='/join_group/:leaderId/:groupId/:userId' element={user ? <JoinGroupPage /> : <Navigate to='/login' />} />
          </Routes>
        </div>
    </Router>
  )
}

export default App