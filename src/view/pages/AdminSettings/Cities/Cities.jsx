import React, { useCallback, useContext, useEffect, useState } from 'react';
import './style.scss';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import isEmpty from 'lodash.isempty';
import { nanoid } from 'nanoid';
import { DashboardContext } from '../../../components/DashboardContext';
import CitiesItems from './CitiesItems';
import AddCities from '../../../components/AddCities/AddCities';
import useFetch from '../../../../hooks/useFetch';
import CitiesService from '../../../../services/CITIES/CitiesService';
import ConfirmDelete from '../../../components/ConfirmDelete/ConfirmDelete';
import ConnectedFills from './ConnectedFills';

const Cities = () => {
  const { cities, fetchCities } = useContext(DashboardContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteCondidateId, setDeleteCondidateId] = useState('');
  const [selectedFill, setSelectedFill] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (isEmpty(cities)) {
      fetchCities();
      setSelectedCity({});
    }
  }, [fetchCities, cities]);

  const createCities = useCallback(() => setOpen(true), []);
  const onHandleClose = useCallback(() => {
    setOpen(false);
    setErrorMessage('');
    setSelectedCity({});
  }, []);

  const onGetDelete = useCallback(() => {
    fetchCities();
  }, [fetchCities]);

  const { fetch: fetchDeleteCities } = useFetch({
    requestFunction: CitiesService.delete,
    setResponse: onGetDelete
  });

  const onGetResponse = useCallback((resp) => {
    const { departments } = resp.data;
    setSelectedFill(departments);
    setIsDataFetched(true);
  }, []);

  const { fetch: fetchSelectedCity } = useFetch({
    requestFunction: CitiesService.getRequestWithID,
    setResponse: onGetResponse
  });

  const onChangeCity = useCallback((item) => {
    setSelectedCity(item);
    createCities();
  }, [createCities]);

  const onOpenConfirmDelete = useCallback((id) => {
    setDeleteCondidateId(id);
    setOpenConfirm(true);
  }, []);

  const onCloseConfirm = useCallback(() => {
    setDeleteCondidateId('');
    setOpenConfirm(false);
  }, []);

  const deleteCities = useCallback(() => {
    fetchDeleteCities(deleteCondidateId);
  }, [fetchDeleteCities, deleteCondidateId]);

  const onSelectCities = useCallback((id) => {
    setSelectedFill([]);
    fetchSelectedCity({ id });
  }, [fetchSelectedCity]);

  const renderCities = useCallback(() => {
    if (!isEmpty(cities)) {
      return cities.map((item) => (
        <CitiesItems
          item={item}
          key={item.id}
          onChangeCity={onChangeCity}
          onSelectCities={onSelectCities}
          onOpenConfirmDelete={onOpenConfirmDelete}
        />
      ));
    }
  }, [cities, onChangeCity, onSelectCities, onOpenConfirmDelete]);

  const renderDepart = useCallback(() => {
    if (!isEmpty(selectedFill)) {
      return selectedFill.map((item) => (
        <ConnectedFills
          item={item}
          key={nanoid()}
        />
      ));
    }
    if (isEmpty(selectedFill)) {
      if (isDataFetched) {
        return (
          <TableRow>
            <TableCell align="center" colSpan={3}>Нет данных для отображения. Попробуйте выбрать другой филиал.</TableCell>
          </TableRow>
        );
      }
      return (
        <TableRow>
          <TableCell align="center" colSpan={3}>Для отображения данных выберите город</TableCell>
        </TableRow>
      );
    }
  }, [selectedFill, isDataFetched]);

  return (
    <div className="cities">
      <div className="cities-main">
        <div className="cities-actions">
          <Button variant="outlined" onClick={createCities}>Добавить город</Button>
        </div>
        <div className="cities-table">
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell component="th" align="left">Город</TableCell>
                  <TableCell component="th" padding="checkbox" align="center" />
                  <TableCell component="th" padding="checkbox" align="center" />
                </TableRow>
              </TableHead>
              <TableBody>
                {renderCities()}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="cities-table">
          <TableContainer>
            <Table sx={{ minWidth: 650, marginTop: '50px' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell component="th" align="left">Филиал</TableCell>
                  <TableCell component="th" align="center">Отделения</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderDepart()}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <AddCities
        open={open}
        selectedCity={selectedCity}
        handleClose={onHandleClose}
        errorMessage={errorMessage}
        setSelectedCity={setSelectedCity}
        setErrorMessage={setErrorMessage}
      />
      <ConfirmDelete
        open={openConfirm}
        onClose={onCloseConfirm}
        onClickButton={deleteCities}
        label="Вы уверены что хотите удалить этот город?"
      />
    </div>
  );
};

export default Cities;
