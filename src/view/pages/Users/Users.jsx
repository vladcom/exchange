import React, { useCallback, useContext, useEffect, useState } from 'react';
import './styles.scss';
import {
  Button,
  FormControl,
  MenuItem, Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@mui/material';
import isEmpty from 'lodash.isempty';
import UsersItem from './UsersItem';
import { DashboardContext } from '../../components/DashboardContext';
import { useDebounce } from '../../../hooks/useDebounce';
import AddUser from '../../components/AddUser/AddUser';

const Users = () => {
  const { users, usersCount, fetchUsers } = useContext(DashboardContext);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Все');
  const [type, setType] = useState('Все');
  const [page, setPage] = useState(Number(localStorage.getItem('usersPage')) || 1);
  const [perPage, setPerPage] = useState(Number(localStorage.getItem('usersPerPage')) || 5);
  const debouncedName = useDebounce(name, 2000);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    fetchUsers({
      page,
      per_page: perPage,
      fio: debouncedName,
      role_id: type === 'Все' ? '' : type,
      status: status === 'Все' ? '' : String(status)
    });
  }, [page, perPage, status, type, debouncedName, fetchUsers]);

  const renderUsers = useCallback(() => {
    if (!isEmpty(users)) {
      return users.map((item) => (
        <UsersItem
          item={item}
          key={item.id}
        />
      ));
    }
  }, [users]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem('usersPage', newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    localStorage.setItem('usersPerPage', String(parseInt(event.target.value, 10)));
    setPage(1);
  };

  const onChangeStatus = useCallback((e) => setStatus(e.target.value), []);
  const onChangeType = useCallback((e) => setType(e.target.value), []);
  const onClickCreateUser = useCallback(() => setIsOpenModal(true), []);
  const onHandleClose = useCallback(() => setIsOpenModal(false), []);

  return (
    <div className="users">
      <div className="users-actions">
        <div className="users-filters">
          <div className="users-filters-item">
            <span className="users-filters-item-label">ФИО</span>
            <div className="users-filters-item-input">
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="users-filters-item">
            <span className="users-filters-item-label">Статус</span>
            <div className="users-filters-item-input">
              <FormControl fullWidth>
                <Select
                  value={status}
                  onChange={onChangeStatus}
                >
                  <MenuItem value="Все">Все</MenuItem>
                  <MenuItem value={1}>Активные</MenuItem>
                  <MenuItem value={0}>Неактивные</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="users-filters-item">
            <span className="users-filters-item-label">Тип</span>
            <div className="users-filters-item-input">
              <FormControl fullWidth>
                <Select
                  value={type}
                  onChange={onChangeType}
                >
                  <MenuItem value="Все">Все</MenuItem>
                  <MenuItem value={1}>Администратор</MenuItem>
                  <MenuItem value={2}>Бухгалтер</MenuItem>
                  <MenuItem value={3}>Кассир</MenuItem>
                  <MenuItem value={4}>Инкассатор</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        <Button variant="outlined" onClick={onClickCreateUser}>Добавить</Button>
      </div>
      <div className="users-table">
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell component="th" align="center">Логин</TableCell>
                <TableCell component="th" align="center">ФИО</TableCell>
                <TableCell component="th" align="center">Права доступа</TableCell>
                <TableCell component="th" align="center">Доступ</TableCell>
                <TableCell component="th" align="center" />
                <TableCell component="th" align="center" />
              </TableRow>
            </TableHead>
            <TableBody>
              {renderUsers()}
            </TableBody>
          </Table>
          <div className="users-pagination">
            <Pagination
              page={page}
              shape="rounded"
              onChange={handleChangePage}
              count={Math.ceil(usersCount / perPage)}
            />
            <TablePagination
              count={100}
              page={page}
              component="div"
              rowsPerPage={perPage}
              labelRowsPerPage="Отображать:"
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </TableContainer>
      </div>
      <AddUser open={isOpenModal} handleClose={onHandleClose} />
    </div>
  );
};

export default Users;
