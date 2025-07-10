# Notes API + Context Integration

## 🚨 **PLEASE MERGE THIS BRANCH INTO DEVELOP ASAP** 🚨

## Summary

- Implemented an **AuthContext** to track the user's token and login status across the app  
  - Handles token presence and expiration across most pages
  (Note: I felt the need to do this in this branch because the tokenization is important for the notes-api to work and could not postpone it through the other branch)

- Added a **NoteContext** to manage the selected note between the Note Panel and Text Editor

- Integrated the **Notes API** with both UI components:
  - Create a note from the Note Panel  
  - Load a selected note into the Text Editor  
  - Save updates to a note from the Text Editor  
  - Display all existing notes in the Note Panel

## Pending Work

- Delete note functionality not yet implemented  
- Frontend components need to be enhanced and cleaned up (will proceed in future frontend branches)  
