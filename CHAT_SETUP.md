# Gemini Chat Assistant - Setup Guide

## Prerequisites
- Gemini API key from [Google AI Studio](https://ai.google.dev/)
- Azure SQL Database configured
- Node.js and npm installed

## Setup Instructions

### 1. Database Setup
Run the SQL migration script to create chat tables:

```sql
-- Execute this in your Azure SQL database
-- File: backend/chat-schema.sql
```

Open `backend/chat-schema.sql` and execute the SQL commands in your Azure SQL Database.

### 2. Backend Configuration

1. **Add Gemini API credentials** to your `backend/.env` file:

```env
# Add these lines to your existing .env file
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

Replace `your_actual_api_key_here` with your actual Gemini API key.

2. **Install backend dependencies** (if not already done):

```bash
cd backend
npm install
```

This will install the `@google/generative-ai` package.

### 3. Frontend Configuration

**Install frontend dependencies**:

```bash
cd frontend
npm install
```

This will install:
- `react-markdown` - For rendering markdown in chat responses
- `react-syntax-highlighter` - For code syntax highlighting

### 4. Start the Application

1. **Start the backend server**:
```bash
cd backend
node index.js
```

Backend will run on `http://localhost:5000`

2. **Start the frontend development server**:
```bash
cd frontend
npm start
```

Frontend will open at `http://localhost:3000`

### 5. Using the Chat Assistant

1. **Login** to your application
2. You'll see a **floating purple chat button** in the bottom-right corner
3. **Click the button** to open the chat assistant
4. **Start chatting!** The assistant can:
   - Answer questions about your notes
   - Help you organize ideas
   - Provide general assistance
   - Remember conversation context

### Features

✅ **Note Context**: The assistant can access your recent notes to answer questions  
✅ **Persistent History**: All conversations are saved to the database  
✅ **Markdown Support**: Responses support formatting, code blocks, lists, etc.  
✅ **Beautiful UI**: Modern, animated interface with gradients  
✅ **Responsive**: Works on desktop and mobile devices  

### Troubleshooting

**Chat button doesn't appear:**
- Make sure you're logged in
- Check browser console for errors
- Verify frontend dependencies installed correctly

**API errors:**
- Verify your Gemini API key is correct in `.env`
- Check that the backend server is running
- Ensure database tables were created successfully

**No responses from assistant:**
- Check backend logs for errors
- Verify your Gemini API key has proper permissions
- Ensure your API key hasn't hit rate limits

### API Endpoints

The following chat endpoints are available:

- `POST /chat/message` - Send a message to the assistant
- `GET /chat/history/:conversationId` - Get conversation history
- `GET /chat/conversations` - Get all user conversations
- `DELETE /chat/conversation/:conversationId` - Delete a conversation
- `PUT /chat/conversation/:conversationId/title` - Update conversation title

All endpoints require authentication via JWT token.

## Next Steps

Consider these enhancements:
- Add conversation list sidebar to view/switch between chats
- Export chat conversations
- Add voice input support
- Implement chat suggestions based on note content
- Add ability to create notes directly from chat
