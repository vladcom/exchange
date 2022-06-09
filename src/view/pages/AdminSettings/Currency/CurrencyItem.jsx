import React from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, TableCell, TableRow } from '@mui/material';

const CurrencyItem = ({ item, isEditable, handleEditCur }) => {
  const { id, rate, title } = item;

  return (
    <TableRow>
      <TableCell>{id}</TableCell>
      <TableCell align="left">{title}</TableCell>
      <TableCell align="center">{rate[0].buyRate}</TableCell>
      <TableCell align="center">{rate[0].sellRate}</TableCell>
      {isEditable
        ? (
          <TableCell align="center">
            <IconButton
              title="Редактировать"
              onClick={() => handleEditCur(item)}
            >
              <EditIcon style={{ fill: 'white' }} />
            </IconButton>
          </TableCell>
        )
        : null }
    </TableRow>
  );
};

CurrencyItem.propTypes = {
  item: PropTypes.object,
  isEditable: PropTypes.bool,
  handleEditCur: PropTypes.func
};

export default CurrencyItem;
