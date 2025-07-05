import './App.css';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import TextEditor from '../TextEditor/TextEditor';
import TopBar from '../Components/TopBar';
import Sidebar from '../Components/Sidebar';
import NotePanel from '../Components/NotePanel';
import Screen from './Screen';
import Login from '../Authentication/Login';
import SignUp from '../Authentication/SignUp';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
function App() {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/screen" : "/login"} />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/screen" /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/screen" /> : <SignUp />} />
        <Route path="/screen" element={isLoggedIn ? <Screen /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
