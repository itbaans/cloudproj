import NotePanel from "../Components/NotePanel";
import TextEditor from "../TextEditor/TextEditor";

function Screen() {
    return (
        <div className="d-flex flex-row ">
            <NotePanel></NotePanel>
            <TextEditor></TextEditor>
        </div>
    );
}

export default Screen;
