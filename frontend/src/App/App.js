// App.js
import './App.css';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

import Login from '../Authentication/Login';
import SignUp from '../Authentication/SignUp';
import Screen from './Screen';
// import Dashboard from '../Components/Dashboard';
// import UserPage from './UserPage';

import Layout from '../App/AppLayout'; // New layout with Sidebar
import { useAuth } from '../Authentication/AuthContext';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/screen" : "/login"} />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/screen" /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/screen" /> : <SignUp />} />

        {isLoggedIn && (
          <Route element={<Layout />}>
            <Route path="/screen" element={<Screen />} />
            {/*<Route path="/dashboard" element={<Dashboard />} />*/}
            {/*<Route path="/userpage" element={<UserPage />} />*/}
          </Route>
        )}

        {!isLoggedIn && (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
