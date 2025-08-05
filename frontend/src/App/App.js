// App.js
import './App.css';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from '../Authentication/Login';
import SignUp from '../Authentication/SignUp';
import Screen from './Screen';
import Dashboard from '../Dashboard/Dashboard';
// import UserPage from './UserPage';

import Layout from '../App/AppLayout'; // New layout with Sidebar
import { useAuth } from '../Authentication/AuthContext';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const { isLoggedIn } = useAuth();
  const sampleNotes = [
  {
    id: 1,
    title: "Grocery List",
    content: "Milk, Eggs, Bread, Butter, Coffee",
    date: "2025-08-05"
  },
  {
    id: 2,
    title: "Meeting Notes",
    content: "Discuss project deadlines, frontend tasks, and backend API integration.",
    date: "2025-08-04"
  },
  {
    id: 3,
    title: "Ideas for Blog",
    content: "Write about React hooks, performance optimization, and component patterns.",
    date: "2025-08-02"
  },
  {
    id: 4,
    title: "Workout Plan",
    content: "Mon: Chest | Tue: Back | Wed: Legs | Thu: Shoulders | Fri: Arms",
    date: "2025-07-31"
  },
  {
    id: 5,
    title: "Travel Checklist",
    content: "Passport, Tickets, Power Bank, Toiletries, Meds",
    date: "2025-07-30"
  },
  {
    id: 1,
    title: "Grocery List",
    content: "Milk, Eggs, Bread, Butter, Coffee",
    date: "2025-08-05"
  },
  {
    id: 2,
    title: "Meeting Notes",
    content: "Discuss project deadlines, frontend tasks, and backend API integration.",
    date: "2025-08-04"
  },
  {
    id: 3,
    title: "Ideas for Blog",
    content: "Write about React hooks, performance optimization, and component patterns.",
    date: "2025-08-02"
  },
  {
    id: 4,
    title: "Workout Plan",
    content: "Mon: Chest | Tue: Back | Wed: Legs | Thu: Shoulders | Fri: Arms",
    date: "2025-07-31"
  },
  {
    id: 5,
    title: "Travel Checklist",
    content: "Passport, Tickets, Power Bank, Toiletries, Meds",
    date: "2025-07-30"
  }
];


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <SignUp />} />

        {isLoggedIn && (
          <Route element={<Layout />}>
            <Route path="/notes" element={<Screen />} />
            <Route path="/home" element={<Dashboard />} />
            {/*<Route path="/user" element={<UserPage />} />*/}
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
