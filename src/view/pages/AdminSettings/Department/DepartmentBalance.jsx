import React, { useCallback, useEffect, useState } from 'react';
import './styles.scss';
import { useParams } from 'react-router-dom';
import isEmpty from 'lodash.isempty';
import { nanoid } from 'nanoid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useFetch from '../../../../hooks/useFetch';
import PageWrapper from '../../../common/PageWrapper/PageWrapper';
import DepartmentsService from '../../../../services/DEPARTMENTS/DepartmentsService';
import DepartmentBalanceItem from './DepartmentBalanceItem';
import AlertSnackbar from '../../../common/Snackbar/AlertSnackbar';
import BalancesService from '../../../../services/BALANCE/BalancesService';

const DepartmentBalance = () => {
  const { id } = useParams();
  const [depData, setDepData] = useState([]);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTimeout(() => {
      if (isOpenSnackbar) {
        setIsOpenSnackbar(false);
      }
    }, 5000);

    return () => clearTimeout();
  }, [isOpenSnackbar]);

  const onGetResponse = useCallback((res) => {
    if (!res.message) {
      setDepData(res.data);
    }
  }, []);

  const { fetch: fetchDepData } = useFetch({
    requestFunction: DepartmentsService.getRequestWithID,
    setResponse: onGetResponse
  });

  useEffect(() => {
    if (isEmpty(depData)) {
      fetchDepData({ id });
    }
  }, [depData, fetchDepData, id]);

  const onGetResponseBalance = useCallback((resp) => {
    if (resp.data) {
      setIsOpenSnackbar(true);
      setIsSuccess(true);
      setMessage('Баланс обнавлен успешно');
      fetchDepData({ id });
    }
    if (!resp.data) {
      setIsOpenSnackbar(true);
      setIsSuccess(false);
      setMessage('Ошибка');
    }
  }, [fetchDepData, id]);

  const { fetch: fetchNewBalance } = useFetch({
    requestFunction: BalancesService.putRequestForBalance,
    setResponse: onGetResponseBalance
  });

  const onSubmitSaveNewValue = useCallback((data) => {
    const { id: currencyId, balance } = data;
    fetchNewBalance({
      balance: String(balance),
      departmentId: Number(id),
      currencyId: Number(currencyId)
    });
  }, [fetchNewBalance, id]);

  const renderTitle = useCallback(() => {
    if (!isEmpty(depData)) {
      const { title } = depData;
      return title;
    }
  }, [depData]);

  const renderCurrency = useCallback(() => {
    if (!isEmpty(depData)) {
      const { currencies } = depData;
      return currencies.map((item) => (
        <DepartmentBalanceItem
          item={item}
          key={nanoid()}
          onSubmitSaveNewValue={onSubmitSaveNewValue}
        />
      ));
    }
  }, [depData, onSubmitSaveNewValue]);

  return (
    <PageWrapper>
      <div className="selectedDepartment">
        <p className="selectedDepartment-title">
          {renderTitle()}
        </p>
        <div className="selectedDepartment-table">
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Валюта</TableCell>
                  <TableCell component="th" align="left">Баланс</TableCell>
                  <TableCell component="th" align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {renderCurrency()}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <AlertSnackbar isOpen={isOpenSnackbar} message={message} success={isSuccess} />
    </PageWrapper>
  );
};

export default DepartmentBalance;
