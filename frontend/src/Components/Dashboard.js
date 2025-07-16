import React, { useState } from 'react';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample notes data
  // ONLY A TEST DASHBOARD, NOT THE ONE IM WORKING ON
  const notes = [
    {
      id: 1,
      title: "Meeting Notes - Q1 Planning",
      preview: "Discussed project timelines, resource allocation, and key deliverables for the upcoming quarter. Action items include...",
      lastUpdated: "2 hours ago"
    },
    {
      id: 2,
      title: "Recipe Ideas",
      preview: "Pasta with roasted vegetables, homemade pizza dough recipe, and that amazing chocolate cake from last weekend...",
      lastUpdated: "Yesterday"
    },
    {
      id: 3,
      title: "Book Recommendations",
      preview: "The Seven Husbands of Evelyn Hugo was incredible. Next up: Klara and the Sun by Kazuo Ishiguro. Also consider...",
      lastUpdated: "3 days ago"
    },
    {
      id: 4,
      title: "Travel Plans - Summer 2025",
      preview: "Potential destinations: Japan (cherry blossom season), Italy (Tuscany region), or maybe a road trip through...",
      lastUpdated: "1 week ago"
    },

  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>
        {`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css');
          
          .notes-scroll {
            overflow-x: auto;
          }
          
          .notes-flex {
            display: flex;
            gap: 1rem;
            width: max-content;
          }
          
          .note-card {
            width: 300px;
            min-height: 180px;
            flex-shrink: 0;
          }
          
          .note-preview {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
      
      <div className="min-vh-100 bg-light">
        {/* Header */}
        <div className="bg-white border-bottom sticky-top">
          <div className="container-fluid py-3">
            <div className="row align-items-center">
              <div className="col">
                <h1 className="h3 mb-1">My Notes</h1>
                <p className="text-muted mb-0">
                  {getGreeting()}, Alex! Ready to capture your thoughts?
                </p>
              </div>
              <div className="col-auto">
                <button className="btn btn-primary">
                  <i className="me-2">+</i>New Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i>🔍</i>
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search your notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="container-fluid">
          <div className="row mb-3">
            <div className="col">
              <h2 className="h5">Recent Notes</h2>
            </div>
            <div className="col-auto">
              <small className="text-muted">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
              </small>
            </div>
          </div>
          
          {filteredNotes.length > 0 ? (
            <div className="notes-scroll pb-3">
              <div className="notes-flex">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="card note-card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title h6">{note.title}</h5>
                        <small className="text-muted">✏️</small>
                      </div>
                      <p className="card-text text-muted small note-preview">
                        {note.preview}
                      </p>
                      <div className="mt-auto">
                        <small className="text-muted">
                          <i className="me-1">🕐</i>
                          Last updated {note.lastUpdated}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3">
                <i style={{ fontSize: '3rem' }}>🔍</i>
              </div>
              <h4>No notes found</h4>
              <p className="text-muted">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;