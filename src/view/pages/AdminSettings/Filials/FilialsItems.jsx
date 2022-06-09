import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, TableCell, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';

const FilialsItems = ({ item, onOpenConfirmDelete, onChangeFilial, onSelectFilial }) => {
  const { id, title } = item;

  return (
    <TableRow>
      <TableCell style={{ cursor: 'pointer' }} onClick={() => onSelectFilial(id)}>{id}</TableCell>
      <TableCell style={{ cursor: 'pointer' }} onClick={() => onSelectFilial(id)} align="left">{title}</TableCell>
      <TableCell padding="checkbox">
        <IconButton
          onClick={() => onChangeFilial(item)}
          title="Редактировать филиал"
        >
          <EditIcon />
        </IconButton>
      </TableCell>
      <TableCell padding="checkbox">
        <IconButton
          title="Удалить филиал"
          onClick={() => onOpenConfirmDelete({ id })}
        >
          <ClearIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

FilialsItems.propTypes = {
  item: PropTypes.object,
  onChangeFilial: PropTypes.func,
  onSelectFilial: PropTypes.func,
  onOpenConfirmDelete: PropTypes.func
};

export default FilialsItems;
