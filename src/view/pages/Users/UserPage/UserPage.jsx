import React, { useCallback, useContext, useEffect, useState } from 'react';
import '../styles.scss';
import { Button, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import isEmpty from 'lodash.isempty';
import { isUndefined } from '../../../../utils/isUndefined';
import { DashboardContext } from '../../../components/DashboardContext';
import AddUser from '../../../components/AddUser/AddUser';
import useIsMounted from '../../../../hooks/useIsMounted';

const UserPage = () => {
  const isMounted = useIsMounted();
  const location = useLocation();
  const { pathname } = location;
  const { selectedUser, isFetchingUser, fetchSelectedUser } = useContext(DashboardContext);
  const userId = pathname.slice(16);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onHandleClose = useCallback(() => setIsOpenModal(false), []);
  const onHandleOpen = useCallback(() => setIsOpenModal(true), []);

  useEffect(() => {
    if (isMounted.current) {
      fetchSelectedUser({ id: userId });
    }
  }, [fetchSelectedUser, isMounted, userId]);

  const renderCity = useCallback(() => {
    if (!isEmpty(selectedUser)) {
      const { cities } = selectedUser;
      let str = '';
      cities.map((item) => {
        str += `${item.title}, `;
        return null;
      });
      return str.substr(0, str.length - 2);
    }
  }, [selectedUser]);

  if (isFetchingUser) {
    return (
      <div className="selectedUser">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="selectedUser">
      <div className="selectedUser-title">
        {`${selectedUser.lastname} ${selectedUser.firstname} ${selectedUser.patronymic}`}
      </div>
      <div className="selectedUser-options">
        <div className="selectedUser-options-item">
          <span>Дата рождения</span>
          <span className="selectedUser-options-item-value">{selectedUser.dob || '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Город</span>
          <span className="selectedUser-options-item-value">{renderCity() || '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Должность</span>
          <span className="selectedUser-options-item-value">{!isUndefined(selectedUser.role) ? selectedUser.role.title : '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Телефон</span>
          <span className="selectedUser-options-item-value">{selectedUser.phone || '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Телеграм</span>
          <span className="selectedUser-options-item-value">{selectedUser.telegram_chat_id || '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Дополнительный контакт</span>
          <span className="selectedUser-options-item-value">{selectedUser.additional_contact || '-'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Доступ</span>
          <span className="selectedUser-options-item-value">{selectedUser.access ? 'Разрешен' : 'Запрещен'}</span>
        </div>
        <div className="selectedUser-options-item">
          <span>Статус</span>
          <span className="selectedUser-options-item-value">{selectedUser.status ? 'Активен' : 'Неактивен'}</span>
        </div>
      </div>
      {!isEmpty(selectedUser) ? (
        <Button onClick={onHandleOpen}>Редактировать</Button>
      ) : null}
      <AddUser isEdit open={isOpenModal} handleClose={onHandleClose} />
    </div>
  );
};

export default UserPage;
