import Sidebar from "../Components/Sidebar";
import NotePanel from "../Components/NotePanel";
import TextEditor from "../TextEditor/TextEditor";
import Dashboard from "../Dashboard/Dashboard";

function Screen(){ 
return(

    <div className="container-fluid d-flex flex-row ">
    <NotePanel></NotePanel>
    <TextEditor></TextEditor>
    
</div>
)
}

export default Screen; 