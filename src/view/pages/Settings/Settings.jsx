import React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';

const Settings = () => (
  <div className="settings">
    <div className="settings-menu">
      <Link to="/settings" className="settings-menu-item disabled"><span>Переменные</span></Link>
      <Link to="/settings/filials" className="settings-menu-item"><span>Филиалы</span></Link>
      <Link alt="Настройка городов" to="/settings/cities" className="settings-menu-item"><span>Города</span></Link>
      <Link alt="Настройка пользователей" to="/settings/users" className="settings-menu-item"><span>Пользователи</span></Link>
      <Link to="/settings/departments" className="settings-menu-item"><span>Отделения</span></Link>
      <Link to="/settings" className="settings-menu-item disabled"><span>Инкасаторы</span></Link>
    </div>
  </div>
);

export default Settings;
