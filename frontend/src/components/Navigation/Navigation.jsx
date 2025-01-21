import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from '../../../public/logo.png';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="nav-bar">
      <div className="logo-container">
        <Link to='/'>
          <img src={logo} alt="StudentStays Logo" />
        </Link>
      </div>
      {/* Navigation Buttons */}
      <div className="nav-buttons">
        {sessionUser && (
          <Link to="/spots/new" className="create-spot-link">
            Create a New Spot
          </Link>
        )}
      </div>
      
      <div className="profile-button-container">
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </nav>
  );
}

export default Navigation;