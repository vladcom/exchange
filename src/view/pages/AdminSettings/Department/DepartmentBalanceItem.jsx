import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TableCell, TableRow, TextField } from '@mui/material';

const DepartmentBalanceItem = ({ item, onSubmitSaveNewValue }) => {
  const { id, title, balance } = item;
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(balance);

  const onClickEdit = useCallback(() => {
    setIsEdit((prevState) => !prevState);
  }, []);

  const onClickSave = useCallback(() => {
    onSubmitSaveNewValue({ id, balance: value });
    onClickEdit();
  }, [onSubmitSaveNewValue, id, onClickEdit, value]);

  const renderButton = useCallback(() => {
    if (!isEdit) {
      return <Button onClick={onClickEdit}>Изменить</Button>;
    }
    if (isEdit) {
      return (
        <>
          <Button
            variant="contained"
            onClick={onClickSave}
            style={{ marginRight: '20px' }}
          >
            Сохранить
          </Button>
          <Button
            variant="outlined"
            onClick={onClickEdit}
          >
            Отменить
          </Button>
        </>
      );
    }
  }, [isEdit, onClickSave, onClickEdit]);

  const onChangeInput = useCallback((e) => setValue(e.target.value), []);

  return (
    <TableRow>
      <TableCell align="left">{title}</TableCell>
      <TableCell align="left">
        <TextField
          type="number"
          value={value}
          disabled={!isEdit}
          onChange={onChangeInput}
        />
      </TableCell>
      <TableCell align="right">{renderButton()}</TableCell>
    </TableRow>
  );
};

DepartmentBalanceItem.propTypes = {
  item: PropTypes.object,
  onSubmitSaveNewValue: PropTypes.func
};

export default DepartmentBalanceItem;
