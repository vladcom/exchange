import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { TableCell, TableRow } from '@mui/material';
import { isNull } from '../../../../utils/isNull';

const ConnectedCity = ({ item }) => {
  const { id, title, city } = item;

  const renderCityTitle = useCallback(() => {
    if (isNull(city)) {
      return '-';
    }

    if (!isNull(city)) {
      const { title: titleCity } = city;
      if (!isNull(titleCity)) {
        return titleCity;
      }
      return '-';
    }
  }, [city]);

  return (
    <TableRow key={nanoid()}>
      <TableCell>{id}</TableCell>
      <TableCell align="left">{renderCityTitle()}</TableCell>
      <TableCell align="center">{!isNull(title) ? title : '-'}</TableCell>
    </TableRow>
  );
};

ConnectedCity.propTypes = {
  item: PropTypes.object
};

export default ConnectedCity;
