import { Button } from '@/components/ui/button'
import React, {useState, useEffect} from 'react'
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import Auth from "./pages/auth"
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  
  if (isAuthenticated) {
    // Check if profile is set up
    if (userInfo && userInfo.profileSetup) {
      return <Navigate to="/chat" />;
    } else {
      return <Navigate to="/profile" />;
    }
  }
  return children;
}


const App =() => {

    const {userInfo, setUserInfo}  =useAppStore();
    const [loading , setLoading] = useState(true);

    useEffect(()=> {
      const getUserData =async ()=> {
        try {
          const response = await apiClient.get(GET_USER_INFO, {
            withCredentials: true,
          });
          if(response.status === 200 && response.data.user.id) {
            setUserInfo(response.data.user);
          }
          else {
            setUserInfo(undefined);
          }
           console.log({response});}
        catch(error) {
          setUserInfo(undefined)
        }
        finally {
          setLoading(false)
        }
         
      };
      if(!userInfo) {
        getUserData();
      }
      else {
        setLoading(false);
      }
    }, [userInfo, setUserInfo]);

    if(loading) {
      return <div>Loading...</div>
    }

  return (
    <div>
     <BrowserRouter>
     <Routes>
      <Route path="/auth" element={<AuthRoute> <Auth/> </AuthRoute> } />
      <Route path="/chat" element={<PrivateRoute> <Chat /> </PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /> </PrivateRoute>} />

      <Route path="*" element={<Navigate to="/auth" />}/>
      </Routes>
      </BrowserRouter>
      
    </div>
  );
};

export default App
