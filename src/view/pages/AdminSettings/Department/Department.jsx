import React, { useCallback, useContext, useEffect, useState } from 'react';
import './styles.scss';
import isEmpty from 'lodash.isempty';
import {
  Button,
  FormControl, MenuItem,
  Pagination, Select, Table,
  TableBody, TableCell,
  TableContainer, TableHead,
  TablePagination, TableRow
} from '@mui/material';
import { DashboardContext } from '../../../components/DashboardContext';
import DepartmentsItems from './DepartmentsItems';
import AddDepartments from '../../../components/AddDepartments/AddDepartments';

const Department = () => {
  const {
    cities,
    filials,
    departments,
    fetchCities,
    fetchFilials,
    departmentsCount,
    fetchDepartments
  } = useContext(DashboardContext);
  const [isActive, setIsActive] = useState('Все');
  const [isCentral, setIsCentral] = useState('Все');
  const [selectedFilial, setSelectedFilial] = useState('Все');
  const [selectedCity, setSelectedCity] = useState('Все');
  const [page, setPage] = useState(Number(localStorage.getItem('departmentsPage')) || 1);
  const [perPage, setPerPage] = useState(Number(localStorage.getItem('departmentsPerPage')) || 5);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDep, setSelectedDep] = useState({});

  useEffect(() => {
    fetchDepartments({
      page,
      per_page: perPage,
      city_id: selectedCity === 'Все' ? '' : selectedCity,
      filial_id: selectedFilial === 'Все' ? '' : selectedFilial,
      isActive: isActive === 'Все' ? '' : String(isActive),
      isCentral: isCentral === 'Все' ? '' : String(isCentral)
    });
  }, [fetchDepartments, page, perPage, isActive, selectedCity, selectedFilial, isCentral]);

  useEffect(() => {
    if (isEmpty(filials)) {
      fetchFilials();
    }
  }, [filials, fetchFilials]);

  useEffect(() => {
    if (isEmpty(cities)) {
      fetchCities();
    }
  }, [cities, fetchCities]);

  const handleOpenModal = useCallback(() => setOpenModal(true), []);
  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedDep({});
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem('departmentsPage', newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    localStorage.setItem('departmentsPerPage', String(parseInt(event.target.value, 10)));
    setPage(1);
  };

  const onChangeStatus = useCallback((e) => setIsActive(e.target.value), []);
  const onChangeType = useCallback((e) => setIsCentral(e.target.value), []);
  const onChangeFilial = useCallback((e) => setSelectedFilial(e.target.value), []);
  const onChangeCity = useCallback((e) => setSelectedCity(e.target.value), []);

  const onSelectDep = useCallback((item) => {
    setSelectedDep(item);
    handleOpenModal();
  }, [handleOpenModal]);

  const renderDepartments = useCallback(() => {
    if (!isEmpty(departments)) {
      return departments.map((item) => (
        <DepartmentsItems
          item={item}
          key={item.id}
          onSelectDep={onSelectDep}
        />
      ));
    }
  }, [departments, onSelectDep]);

  return (
    <div className="department">
      <div className="department-actions">
        <div className="department-filters">
          <div className="department-filters-item">
            <span className="department-filters-item-label">Филиал</span>
            <div className="department-filters-item-input">
              <FormControl fullWidth>
                <Select
                  value={selectedFilial}
                  onChange={onChangeFilial}
                >
                  <MenuItem value="Все">Все</MenuItem>
                  {filials.map((item) => (
                    <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="users-filters-item">
            <span className="users-filters-item-label">Город</span>
            <div className="users-filters-item-input">
              <FormControl fullWidth>
                <Select
                  value={selectedCity}
                  onChange={onChangeCity}
                >
                  <MenuItem value="Все">Все</MenuItem>
                  {cities.map((item) => (
                    <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="users-filters-item">
            <span className="users-filters-item-label">Статус</span>
            <div className="users-filters-item-input">
              <FormControl fullWidth>
                <Select
                  value={isActive}
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
                  value={isCentral}
                  onChange={onChangeType}
                >
                  <MenuItem value="Все">Все</MenuItem>
                  <MenuItem value={1}>Центральное</MenuItem>
                  <MenuItem value={0}>Региональное</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        <Button variant="outlined" onClick={handleOpenModal}>Добавить отделение</Button>
      </div>
      <div className="users-table">
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell component="th" align="center">Филиал</TableCell>
                <TableCell component="th" align="center">Город</TableCell>
                <TableCell component="th" align="center">Название</TableCell>
                <TableCell component="th" align="center">Статус</TableCell>
                <TableCell component="th" align="center">Изменить</TableCell>
                <TableCell component="th" align="center">Баланс</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderDepartments()}
            </TableBody>
          </Table>
          <div className="users-pagination">
            <Pagination
              page={page}
              shape="rounded"
              onChange={handleChangePage}
              count={Math.ceil(departmentsCount / perPage)}
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
      <AddDepartments selectedDep={selectedDep} open={openModal} onClose={handleCloseModal} />
    </div>
  );
};

export default Department;
