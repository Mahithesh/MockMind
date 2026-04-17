import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import { BsCameraVideo, BsSun, BsMoon } from 'react-icons/bs';
import { MdDashboard, MdHistory, MdLogout } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import './index.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <BsCameraVideo className="brand-icon" />
          <span className="brand-text">MindMock</span>
        </Link>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}
          >
            <MdDashboard className="nav-link-icon" />
            Dashboard
          </Link>
          <Link
            to="/history"
            className={`nav-link ${location.pathname === '/history' ? 'nav-link-active' : ''}`}
          >
            <MdHistory className="nav-link-icon" />
            History
          </Link>
        </div>
      </div>
      <div className="navbar-right">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {isDarkMode ? <BsSun className="theme-icon sun" /> : <BsMoon className="theme-icon moon" />}
        </button>
        {user && (
          <div className="navbar-user-section">
            <FaUser className="user-icon" />
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <MdLogout className="logout-icon" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
