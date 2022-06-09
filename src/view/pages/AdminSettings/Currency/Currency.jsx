import React, { useCallback, useContext, useEffect, useState } from 'react';
import './style.scss';
import isEmpty from 'lodash.isempty';
import moment from 'moment';
import ruLocale from 'date-fns/locale/ru';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { nanoid } from 'nanoid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker, LocalizationProvider } from '@mui/lab';
import AddCurrency from '../../../components/AddCurrency/AddCurrency';
import CurrencyItem from './CurrencyItem';
import PageWrapper from '../../../common/PageWrapper/PageWrapper';
import { DashboardContext } from '../../../components/DashboardContext';

const Currency = () => {
  const { currency, fetchCurrencies } = useContext(DashboardContext);
  const [selectedCur, setSelectedCur] = useState({});
  const [date, setDate] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const now = new Date();
    const selDate = date.setHours(0, 0, 0, 0);
    const currentDate = now.setHours(0, 0, 0, 0);

    if (selDate === currentDate) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, [date]);

  const handleOpenModal = useCallback(() => setOpenModal(true), []);
  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedCur({});
  }, []);

  useEffect(() => {
    fetchCurrencies({ date: moment(selectedDate.valueOf()).format('YYYY-MM-DD') });
  }, [selectedDate, fetchCurrencies]);

  const handleEditCur = useCallback((value) => {
    setSelectedCur(value);
    handleOpenModal();
  }, [handleOpenModal]);

  const renderCurrencies = useCallback(() => {
    if (isEmpty(currency)) {
      return null;
    }

    if (!isEmpty(currency)) {
      return currency.map((item) => (
        <CurrencyItem
          item={item}
          key={nanoid()}
          isEditable={isEditable}
          handleEditCur={handleEditCur}
        />
      ));
    }
  }, [currency, isEditable, handleEditCur]);

  return (
    <PageWrapper>
      <div className="currency-actions">
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
          <MobileDatePicker
            value={date}
            closeOnSelect
            showTodayButton
            okText="Выбрать"
            todayText="Сегодня"
            cancelText="Отмена"
            maxDate={new Date()}
            label="Выберите дату"
            onChange={(newValue) => setDate(newValue)}
            onAccept={(selected) => setSelectedDate(selected)}
            renderInput={(params) => (
              <TextField {...params} />
            )}
          />
        </LocalizationProvider>
        <Button variant="outlined" onClick={handleOpenModal}>Добавить валюту</Button>
      </div>
      <div className="currency-table">
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell component="th" align="left">Валюта</TableCell>
                <TableCell component="th" align="center">Покупка</TableCell>
                <TableCell component="th" align="center">Продажа</TableCell>
                {isEditable
                  ? <TableCell component="th" padding="checkbox" align="center" />
                  : null }
              </TableRow>
            </TableHead>
            <TableBody>
              {renderCurrencies()}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <AddCurrency
        open={openModal}
        selectedCur={selectedCur}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
      />
    </PageWrapper>
  );
};

export default Currency;
