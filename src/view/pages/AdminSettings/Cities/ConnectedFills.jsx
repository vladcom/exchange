import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { TableCell, TableRow } from '@mui/material';
import { isNull } from '../../../../utils/isNull';

const ConnectedFills = ({ item }) => {
  const { id, title, filial } = item;

  const renderFilialTitle = useCallback(() => {
    if (isNull(filial)) {
      return '-';
    }

    if (!isNull(filial)) {
      const { title: filTitle } = filial;
      if (!isNull(filTitle)) {
        return filTitle;
      }
      return '-';
    }
  }, [filial]);

  return (
    <TableRow key={nanoid()}>
      <TableCell>{id}</TableCell>
      <TableCell align="left">{renderFilialTitle()}</TableCell>
      <TableCell align="center">{!isNull(title) ? title : '-'}</TableCell>
    </TableRow>
  );
};

ConnectedFills.propTypes = {
  item: PropTypes.object
};

export default ConnectedFills;
