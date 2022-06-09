import React, { useContext, useCallback, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { Button } from '@mui/material';
import isEmpty from 'lodash.isempty';
import { AuthorisationContext } from '../AuthorisationContext';
import ModalWindowCashier from '../ModalWindowCashier/ModalWindowCashier';
import ModalWindowCashierClose from '../ModalWindowCashierClose/ModalWindowCashierClose';
import './style.scss';
import { CashierContext } from '../CashierContext';
import { isUndefined } from '../../../utils/isUndefined';

const SideBarCashier = () => {
  const {
    user: {
      lastname,
      firstname
    },
    cashierData: {
      city,
      title,
      address
    }
  } = useContext(AuthorisationContext);
  const { sessionData } = useContext(CashierContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalEndDay, setIsOpenModalEndDay] = useState(false);

  const onClickSetTime = useCallback(() => setIsOpenModal(true), []);
  const onHandleClose = useCallback(() => setIsOpenModal(false), []);

  const onClinkCloseDay = useCallback(() => setIsOpenModalEndDay(true), []);
  const onHandleCloseDay = useCallback(() => setIsOpenModalEndDay(false), []);

  const renderCashierData = useCallback(() => {
    if (!isUndefined(city) && !isUndefined(title) && !isUndefined(address)) {
      return (
        <>
          <span>{`${city}, ${address}`}</span>
          <span>{title}</span>
        </>
      );
    }
    return null;
  }, [city, title, address]);

  return (
    <div className="sidebar-cashier">
      <div className="sidebar-cashier-user">
        <PersonIcon />
        <div className="sidebar-cashier-name">{`${lastname} ${firstname}`}</div>
      </div>
      {isEmpty(sessionData)
        ? <Button variant="outlined" className="sidebar-cashier-btn" onClick={onClickSetTime}>Открыть день</Button>
        : <Button variant="outlined" className="sidebar-cashier-btn" onClick={onClinkCloseDay}>Закрыть день</Button>}
      <div className="sidebar-cashier-address">
        {renderCashierData()}
      </div>
      <ModalWindowCashier open={isOpenModal} handleClose={onHandleClose} />
      <ModalWindowCashierClose open={isOpenModalEndDay} handleClose={onHandleCloseDay} />
    </div>
  );
};

export default SideBarCashier;
