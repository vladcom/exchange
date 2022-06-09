import React, { useCallback, useContext, useEffect, useState } from 'react';
import '../Cities/style.scss';
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
import useFetch from '../../../../hooks/useFetch';
import FilialService from '../../../../services/FILIAL/FilialService';
import FilialsItems from './FilialsItems';
import AddFilials from '../../../components/AddFilials/AddFilials';
import ConfirmDelete from '../../../components/ConfirmDelete/ConfirmDelete';
import ConnectedCity from './ConnectedCity';

const Filials = () => {
  const { filials, fetchFilials } = useContext(DashboardContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilial, setSelectedFilial] = useState({});
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteCondidateId, setDeleteCondidateId] = useState('');
  const [selectedCity, setSelectedCity] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (isEmpty(filials)) {
      fetchFilials();
    }
  }, [fetchFilials, filials]);

  const createFilial = useCallback(() => setOpen(true), []);
  const onHandleClose = useCallback(() => {
    setErrorMessage('');
    setOpen(false);
    setSelectedFilial({});
  }, []);

  const onGetDelete = useCallback(() => {
    fetchFilials();
  }, [fetchFilials]);

  const { fetch: fetchDeleteFilials } = useFetch({
    requestFunction: FilialService.delete,
    setResponse: onGetDelete
  });

  const onGetResponse = useCallback((resp) => {
    const { departments } = resp.data;
    setSelectedCity(departments);
    setIsDataFetched(true);
  }, []);

  const { fetch: fetchSelectedFilial } = useFetch({
    requestFunction: FilialService.getRequestWithID,
    setResponse: onGetResponse
  });

  const onChangeFilial = useCallback((item) => {
    setSelectedFilial(item);
    createFilial();
  }, [createFilial]);

  const onOpenConfirmDelete = useCallback((id) => {
    setDeleteCondidateId(id);
    setOpenConfirm(true);
  }, []);

  const onCloseConfirm = useCallback(() => {
    setDeleteCondidateId('');
    setOpenConfirm(false);
  }, []);

  const deleteFilials = useCallback(() => {
    fetchDeleteFilials(deleteCondidateId);
  }, [fetchDeleteFilials, deleteCondidateId]);

  const onSelectFilial = useCallback((id) => {
    setSelectedCity([]);
    fetchSelectedFilial({ id });
  }, [fetchSelectedFilial]);

  const renderCities = useCallback(() => {
    if (!isEmpty(filials)) {
      return filials.map((item) => (
        <FilialsItems
          item={item}
          key={item.id}
          onSelectFilial={onSelectFilial}
          onChangeFilial={onChangeFilial}
          onOpenConfirmDelete={onOpenConfirmDelete}
        />
      ));
    }
  }, [filials, onChangeFilial, onSelectFilial, onOpenConfirmDelete]);

  const renderDepart = useCallback(() => {
    if (!isEmpty(selectedCity)) {
      return selectedCity.map((item) => (
        <ConnectedCity
          item={item}
          key={nanoid()}
        />
      ));
    }
    if (isEmpty(selectedCity)) {
      if (isDataFetched) {
        return (
          <TableRow>
            <TableCell align="center" colspan={3}>Нет данных для отображения. Попробуйте выбрать другой филиал.</TableCell>
          </TableRow>
        );
      }
      return (
        <TableRow>
          <TableCell align="center" colspan={3}>Для отображения данных выберите филиал</TableCell>
        </TableRow>
      );
    }
  }, [selectedCity, isDataFetched]);

  return (
    <div className="cities">
      <div className="cities-main">
        <div className="cities-actions">
          <Button variant="outlined" onClick={createFilial}>Добавить филиал</Button>
        </div>
        <div className="cities-table">
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell component="th" align="left">Филиал</TableCell>
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
                  <TableCell component="th" align="left">Город</TableCell>
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
      <AddFilials
        open={open}
        handleClose={onHandleClose}
        errorMessage={errorMessage}
        selectedFilial={selectedFilial}
        setErrorMessage={setErrorMessage}
      />
      <ConfirmDelete
        open={openConfirm}
        onClose={onCloseConfirm}
        onClickButton={deleteFilials}
        label="Вы уверены что хотите удалить этот филиал?"
      />
    </div>
  );
};

export default Filials;
