import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux/store';
import { addUser, removeUser } from "@/redux/features/userSlice";
import { useEffect, useState } from 'react';
import api from './lib/axios';
import { LoaderCircle } from 'lucide-react';
import HomePage from './pages/HomePage';
import GroupsPage from './pages/GroupsPage';
import CreateGroupsPage from './pages/CreateGroupsPage';
import Navbar from './components/Navbar';
import SignUp from './pages/SignUp';
import ViewGroupPage from './pages/ViewGroupPage';
import JoinGroupPage from './pages/JoinGroupPage';
import Login from './pages/LoginPage';

// Helper function to get a cookie by name
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

type userType = {
  email: string;
  token: string;
};

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);
  const [isUserChecked, setIsUserChecked] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if token exists in cookies
        const token = getCookie('access_token'); // Assuming the token is stored in this cookie

        if (token) {
          // If token is found in cookies, check the session on the server
          const response = await api.get("/api/user/session", { withCredentials: true });
          console.log('I WIN: ', response);

          if (response.data.email && response.data.token) {
            const user: userType = { token: response.data.token, email: response.data.email };
            dispatch(addUser(user)); // Update Redux with user data
          } else {
            console.error("dont work");
            dispatch(removeUser()); // Clear user data if session is invalid
          }
        } else {
          dispatch(removeUser()); // No token found, remove user
        }
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
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin pr-2" />
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen h-fit bg-gray-100">
        <Navbar />
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
  );
}

export default App;
