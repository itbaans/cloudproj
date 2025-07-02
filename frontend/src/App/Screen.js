import Sidebar from "../Components/Sidebar";
import NotePanel from "../Components/NotePanel";
import TextEditor from "../TextEditor/TextEditor";

function Screen(){
return(
    <div className="container-fluid d-flex flex-row ">
    <Sidebar></Sidebar>
    <NotePanel></NotePanel>
    <TextEditor></TextEditor>
</div>
)
}

export default Screen;