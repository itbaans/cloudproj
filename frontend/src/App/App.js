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

function App() {
  return (
    <Screen></Screen>
  );
}

export default App;
