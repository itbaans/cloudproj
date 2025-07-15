import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Sidebar({ notebooks = [], onNotebookSelect }) {
  const [activeSection, setActiveSection] = useState('Home');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token, session, etc.
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavigation = (name) => {
    setActiveSection(name);
    navigate(`/${name}`);
  }

  return (
    <div
      className="d-flex flex-column justify-content-between bg-light vh-100 border-end px-2 pt-2 pb-3"
      style={{ width: '160px', fontSize: '0.8rem' }}
    >
      <div>
        {/* App Title */}
        <div className="text-center fw-bold mb-3" style={{ fontSize: '0.9rem' }}>
          Note-taker
        </div>

        {/* User Profile Section */}
        <div
          className="d-flex flex-column align-items-center mb-4 cursor-pointer"
          onClick={() => navigate('/user')}
          style={{ cursor: 'pointer' }}
        >
          <FaUserCircle size={48} className="mb-1 text-secondary" />
          <div className="fw-semibold">John Doe</div>
        </div>

        {/* Section Selectors */}
        <ListGroup variant="flush" className="text-center">
          <ListGroup.Item
            action
            active={activeSection === 'home'}
            onClick={() => handleNavigation('home')}
            className="py-3 px-3 mb-3 border rounded-3"
            style={{ fontSize: '1.0rem' }}
          >
            Home
          </ListGroup.Item>
          <ListGroup.Item
            action
            active={activeSection === 'notes'}
            onClick={() => handleNavigation('notes')}
            className="py-3 px-3 mb-3 border rounded-3"
            style={{ fontSize: '1.0rem' }}
          >
            Notes
          </ListGroup.Item>
  
        </ListGroup>
      </div>

      {/* Logout Button at Bottom */}
      <div className="text-center">
        <button
          className="btn btn-link text-danger fw-bold p-0"
          onClick={handleLogout}
          style={{ fontSize: '0.85rem' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
