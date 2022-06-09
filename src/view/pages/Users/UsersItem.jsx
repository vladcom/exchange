import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, TableCell, TableRow } from '@mui/material';
import { useHistory } from 'react-router-dom';

const UsersItem = ({ item }) => {
  const history = useHistory();
  const {
    id,
    role,
    login,
    access,
    firstname,
    lastname,
    patronymic
  } = item;
  const { title } = role;

  const onClickProfile = useCallback(() => history.push(`/settings/users/${id}`), [id, history]);
  const renderIncasatorButton = useCallback(() => {
    if (title === 'Инкассатор') {
      return <TableCell align="center"><Button variant="outlined" className="disabledMenu">Баланс</Button></TableCell>;
    }
    if (title !== 'Инкассатор') {
      return <TableCell align="center" />;
    }
  }, [title]);

  return (
    <TableRow>
      <TableCell>{id}</TableCell>
      <TableCell align="center">{login}</TableCell>
      <TableCell>{`${lastname} ${firstname} ${patronymic}`}</TableCell>
      <TableCell align="center">{title}</TableCell>
      <TableCell align="center">{access ? 'Eсть' : 'Нет'}</TableCell>
      <TableCell align="center"><Button onClick={onClickProfile} variant="outlined">Профиль</Button></TableCell>
      {renderIncasatorButton()}
    </TableRow>
  );
};

UsersItem.propTypes = {
  item: PropTypes.object
};

export default UsersItem;
