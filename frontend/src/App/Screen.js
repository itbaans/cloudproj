import Sidebar from "../Components/Sidebar";
import NotePanel from "../Components/NotePanel";
import TextEditor from "../TextEditor/TextEditor";
import Dashboard from "../Dashboard/Dashboard";

function Screen(){ 
    const sampleNotes = [
  {
    id: 1,
    title: "Shopping List",
    content: "Buy milk, eggs, bread, and coffee.",
    color: "yellow",
    date: "Today",
  },
  {
    id: 2,
    title: "Project Plan",
    content: "Outline milestones and deadlines for Q3 project.",
    color: "blue",
    date: "Yesterday",
  },
  {
    id: 3,
    title: "Workout Routine",
    content: "Monday: Chest, Tuesday: Back, Wednesday: Legs.",
    color: "green",
    date: "2 days ago",
  },
  {
    id: 4,
    title: "Meeting Notes",
    content: "Discussed product launch strategies with the team.",
    color: "pink",
    date: "3 days ago",
  },
  {
    id: 5,
    title: "Books to Read",
    content: "Start with 'Atomic Habits' and 'Deep Work'.",
    color: "purple",
    date: "1 week ago",
  },
];

return(

    <div className="container-fluid d-flex flex-row ">
    <Sidebar></Sidebar>
    {/*<NotePanel></NotePanel>
    <TextEditor></TextEditor>*/}
    <Dashboard notes={sampleNotes}></Dashboard>
</div>
)
}

export default Screen;