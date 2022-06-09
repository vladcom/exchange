import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, TableCell, TableRow } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { isNull } from '../../../../utils/isNull';

const DepartmentsItems = ({ item, onSelectDep }) => {
  const history = useHistory();
  const {
    id,
    city,
    title,
    filial,
    isActive
  } = item;

  const onHandleEdit = useCallback(() => {
    onSelectDep(item);
  }, [item, onSelectDep]);

  const redirectToBalance = useCallback(() => {
    history.push(`/settings/departments/${id}`);
  }, [id, history]);

  return (
    <TableRow>
      <TableCell>{id}</TableCell>
      <TableCell align="center">{!isNull(filial) ? filial[0].title : '-'}</TableCell>
      <TableCell align="center">{city[0].title}</TableCell>
      <TableCell align="center">{title}</TableCell>
      <TableCell align="center">{isActive ? 'Активно' : 'Неактивно'}</TableCell>
      <TableCell align="center"><Button onClick={onHandleEdit} variant="outlined">Изменить</Button></TableCell>
      <TableCell align="center"><Button onClick={redirectToBalance} variant="outlined">Баланс</Button></TableCell>
    </TableRow>
  );
};

DepartmentsItems.propTypes = {
  item: PropTypes.object,
  onSelectDep: PropTypes.func
};

export default DepartmentsItems;
