import React, { useCallback, useContext, useState } from 'react';
import './style.scss';
import isEmpty from 'lodash.isempty';
import { Button } from '@mui/material';
import { AuthorisationContext } from '../../components/AuthorisationContext';
import { isUndefined } from '../../../utils/isUndefined';
import AddUser from '../../components/AddUser/AddUser';

const Profile = () => {
  const { user } = useContext(AuthorisationContext);
  const {
    dob,
    role,
    phone,
    access,
    status,
    lastname,
    firstname,
    patronymic,
    telegram_chat_id: telegram,
    additional_contact: additionalContact
  } = user;
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onHandleClose = useCallback(() => setIsOpenModal(false), []);
  const onHandleOpen = useCallback(() => setIsOpenModal(true), []);

  const renderCity = useCallback(() => {
    if (!isEmpty(user) && !isUndefined(user.cities)) {
      const { cities } = user;
      let str = '';
      cities.map((item) => {
        str += `${item.title}, `;
        return null;
      });
      return str.substr(0, str.length - 2);
    }
  }, [user]);

  return (
    <div className="selectedUser">
      <p className="profile-title">{`${lastname} ${firstname} ${patronymic}`}</p>
      <div className="selectedUser-options">
        <div className="selectedUser-options-item">
          <span>Дата рождения</span>
          <span className="selectedUser-options-item-value">{dob || '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Город</span>
          <span className="selectedUser-options-item-value">{renderCity() || '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Должность</span>
          <span className="selectedUser-options-item-value">{!isUndefined(role) ? role.title : '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Телефон</span>
          <span className="selectedUser-options-item-value">{phone || '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Телеграм</span>
          <span className="selectedUser-options-item-value">{telegram || '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Дополнительный контакт</span>
          <span className="selectedUser-options-item-value">{additionalContact || '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Доступ</span>
          <span className="selectedUser-options-item-value">{access ? 'Разрешен' : 'Запрещен'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Статус</span>
          <span className="selectedUser-options-item-value">{status ? 'Активен' : 'Неактивен'}</span>
        </div>
      </div>
      {!isEmpty(user) ? (
        <Button onClick={onHandleOpen}>Редактировать</Button>
      ) : null}
      <AddUser isEdit isSelfEdit open={isOpenModal} handleClose={onHandleClose} />
    </div>
  );
};

export default Profile;
