import React, { useCallback, useContext } from 'react';
import './style.scss';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CommentBankIcon from '@mui/icons-material/CommentBank';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddCardIcon from '@mui/icons-material/AddCard';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { Link } from 'react-router-dom';
import SideBarCashier from '../SideBarCashier/SideBarCashier';
import SideBarCashierMenu from '../SideBarCashierMenu/SideBarCashierMenu';
import { AuthorisationContext } from '../AuthorisationContext';

const SideBar = () => {
  const { userRole } = useContext(AuthorisationContext);

  const renderCashierSideBar = useCallback(() => {
    if (userRole === 'Кассир') {
      return (
        <>
          <SideBarCashier />
          <SideBarCashierMenu />
        </>
      );
    }
    return null;
  }, [userRole]);

  const renderSideBar = useCallback(() => {
    if (userRole === 'Администратор') {
      return (
        <>
          <div className="sideBar-menu">
            <Link to="/" disabled className="sideBar-menu-item disabledMenu">
              <AccountBalanceWalletIcon />
              <span>Балансы</span>
            </Link>
            <Link to="/" className="sideBar-menu-item disabledMenu">
              <AccountTreeIcon />
              <span>Операции</span>
            </Link>
            <Link to="/" className="sideBar-menu-item disabledMenu">
              <SummarizeIcon />
              <span>Отчеты</span>
            </Link>
            <Link to="/" className="sideBar-menu-item disabledMenu">
              <WorkHistoryIcon />
              <span>Смены</span>
            </Link>
            <Link to="/" className="sideBar-menu-item disabledMenu">
              <CommentBankIcon />
              <span>Сообщения</span>
            </Link>
            <Link to="/currency" className="sideBar-menu-item">
              <CurrencyExchangeIcon />
              <span>Курсы валют</span>
            </Link>
            <Link to="/" className="sideBar-menu-item disabledMenu">
              <AddCardIcon />
              <span>Зарплаты</span>
            </Link>
            <Link to="/" className="sideBar-menu-item disabledMenu">
              <AccountBalanceIcon />
              <span>Инкассации</span>
            </Link>
            <Link to="/settings" className="sideBar-menu-item">
              <SettingsIcon />
              <span>Настройки</span>
            </Link>
          </div>
        </>
      );
    }

    return null;
  }, [userRole]);

  return (
    <div className="sideBar">
      {renderCashierSideBar()}
      {renderSideBar()}
      <div className="sideBar-contacts">
        <p className="sideBar-contacts-title">Поддержка</p>
        <div className="sideBar-contacts-item">
          <PhoneEnabledIcon />
          <a href="tel:8000345677">8 000 34 56 77</a>
        </div>
        <div className="sideBar-contacts-item">
          <MailOutlineIcon />
          <a href="mailto:money@gmail.com">money@gmail.com</a>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
