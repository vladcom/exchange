import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { IconButton, TableCell, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';

const CitiesItems = ({ item, onChangeCity, onOpenConfirmDelete, onSelectCities }) => {
  const handleSelectRow = useCallback(() => {
    onSelectCities(item.id);
  }, [item, onSelectCities]);

  return (
    <TableRow>
      <TableCell
        onClick={handleSelectRow}
        style={{ cursor: 'pointer' }}
      >
        {item.id}
      </TableCell>
      <TableCell
        align="left"
        onClick={handleSelectRow}
        style={{ cursor: 'pointer' }}
      >
        {item.title}
      </TableCell>
      <TableCell padding="checkbox">
        <IconButton
          title="Редактировать город"
          onClick={() => onChangeCity(item)}
        >
          <EditIcon />
        </IconButton>
      </TableCell>
      <TableCell padding="checkbox">
        <IconButton
          title="Удалить город"
          onClick={() => onOpenConfirmDelete({ id: item.id })}
        >
          <ClearIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

CitiesItems.propTypes = {
  item: PropTypes.object,
  onChangeCity: PropTypes.func,
  onSelectCities: PropTypes.func,
  onOpenConfirmDelete: PropTypes.func
};

export default CitiesItems;
