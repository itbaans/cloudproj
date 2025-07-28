const express = require('express');
const request = require('supertest');
const notesModel = require('../models/notesModel');
const {
  updateNoteContent,
  updateNoteName,
  getNoteContent,
  getAllUserNotes,
  createNewNote,
  deleteNote
} = require('../controllers/notesController');

jest.mock('../models/notesModel');

const app = express();
app.use(express.json());

// Simulate authenticated user middleware
app.use((req, res, next) => {
  req.user = { userId: 123 };
  next();
});

// Routes for controller
app.put('/notes/:noteId/content', updateNoteContent);
app.put('/notes/:noteId/name', updateNoteName);
app.get('/notes/:noteId', getNoteContent);
app.get('/notes', getAllUserNotes);
app.post('/notes', createNewNote);
app.delete('/notes/:noteId', deleteNote);

describe('Notes Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('updateNoteContent - success', async () => {
    notesModel.SaveHTMLInNoteID.mockResolvedValue(true);
    const res = await request(app)
      .put('/notes/1/content')
      .send({ ContentHTML: '<p>Hello</p>' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Note content updated successfully.');
  });

  test('updateNoteContent - missing content', async () => {
    const res = await request(app).put('/notes/1/content').send({});
    expect(res.status).toBe(400);
  });

  test('updateNoteContent - not found', async () => {
    notesModel.SaveHTMLInNoteID.mockResolvedValue(null);
    const res = await request(app)
      .put('/notes/1/content')
      .send({ ContentHTML: '<p>Test</p>' });

    expect(res.status).toBe(404);
  });

  test('updateNoteName - success', async () => {
    notesModel.SaveNewNameInNoteID.mockResolvedValue(true);
    const res = await request(app)
      .put('/notes/1/name')
      .send({ noteName: 'New Title' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Note name updated successfully.');
  });

  test('getNoteContent - success', async () => {
    const mockNote = { id: 1, content: '<p>Example</p>' };
    notesModel.LoadHTMLByNoteID.mockResolvedValue(mockNote);

    const res = await request(app).get('/notes/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockNote);
  });

  test('getAllUserNotes - success', async () => {
    const mockNotes = [
      { id: 1, note_name: 'Note 1', created_at: 'x', updated_at: 'y' }
    ];
    notesModel.findAllNotesByUserID.mockResolvedValue(mockNotes);

    const res = await request(app).get('/notes');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('note_name', 'Note 1');
  });

  test('createNewNote - success', async () => {
    const newNote = {
      id: 1,
      note_name: 'Untitled',
      created_at: 'x',
      updated_at: 'y'
    };
    notesModel.CreateNote.mockResolvedValue(newNote);

    const res = await request(app).post('/notes');

    expect(res.status).toBe(200);
    expect(res.body.note_name).toBe('Untitled');
  });

  test('deleteNote - success', async () => {
    notesModel.DeleteNote.mockResolvedValue({ id: 1 });

    const res = await request(app).delete('/notes/1');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Note delete successfully');
  });
});
