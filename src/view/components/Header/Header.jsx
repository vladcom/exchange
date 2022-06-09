import React, { useContext } from 'react';
import './style.scss';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from 'react-router-dom';
import CurrentTime from '../CurrentTime/CurrentTime';
import { AuthorisationContext } from '../AuthorisationContext';

const Header = () => {
  const { logout } = useContext(AuthorisationContext);
  const history = useHistory();
  return (
    <header className="headerTop">
      <CurrentTime />
      <p className="current-time">Панель администратора</p>
      <div className="headerTop-actions">
        <button onClick={() => history.push('/')}>
          <HomeIcon />
        </button>
        <button onClick={() => history.push('/profile')}>
          <AccountCircleIcon />
        </button>
        <button onClick={logout}>
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
