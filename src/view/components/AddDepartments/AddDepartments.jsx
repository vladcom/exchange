import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import {
  Button, createFilterOptions,
  FormControl, FormHelperText,
  InputLabel, Autocomplete,
  MenuItem,
  Select,
  TextField, FormControlLabel, Checkbox
} from '@mui/material';
import isEmpty from 'lodash.isempty';
import { isPlainObject } from 'is-plain-object';
import deepmerge from 'deepmerge';
import moment from 'moment';
import { DashboardContext } from '../DashboardContext';
import ModalWindow from '../ModalWindow/ModalWindow';
import useIsMounted from '../../../hooks/useIsMounted';
import useFetch from '../../../hooks/useFetch';
import CurrenciesService from '../../../services/CURRENCIES/CurrenciesService';
import combineMerge from '../../../utils/combineMerge';
import { isUndefined } from '../../../utils/isUndefined';
import DepartmentsService from '../../../services/DEPARTMENTS/DepartmentsService';
import { isNull } from '../../../utils/isNull';

const filter = createFilterOptions();

const AddDepartments = ({ open, onClose, selectedDep }) => {
  const isMount = useIsMounted();
  const [title, setTitle] = useState('');
  const [limit, setLimit] = useState('');
  const [cityId, setCityId] = useState('');
  const [salary, setSalary] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [allCur, setAllCur] = useState(false);
  const [filialId, setFilialId] = useState('');
  const [isActive, setIsActive] = useState('');
  const [schedule, setSchedule] = useState('');
  const [tokensArr, setTokensArr] = useState([]);
  const [isCentral, setIsCentral] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [oldCurSet, setOldCurSet] = useState(false);
  const [currencyIds, setCurrencyIds] = useState([]);
  const [isEditableRates, setIsEditableRates] = useState('');
  const [currencySetted, setCurrencySetted] = useState(false);
  const {
    cities,
    filials,
    fetchCities,
    fetchFilials,
    fetchDepartments,
    updateDepartments
  } = useContext(DashboardContext);

  useEffect(() => {
    if (isMount && open && !isEmpty(selectedDep)) {
      setTitle(selectedDep.title);
      setLimit(selectedDep.limit);
      setSalary(selectedDep.salary);
      setAddress(selectedDep.addres);
      setTokensArr(selectedDep.tokens);
      setIsActive(selectedDep.isActive);
      setIsCentral(selectedDep.isCentral);
      setIsEditableRates(selectedDep.isEditableRates);
      setCityId(!isNull(selectedDep.city) ? selectedDep.city[0].id : '');
      setComment(!isNull(selectedDep.comment) ? selectedDep.comment : '');
      setFilialId(!isNull(selectedDep.filial) ? selectedDep.filial[0].id : '');
      setSchedule(!isNull(selectedDep.approx_session_length) ? selectedDep.approx_session_length.slice(0, 5) : '');
    }
  }, [isMount, open, currencySetted, selectedDep]);

  useEffect(() => {
    if (isMount && open && !isEmpty(selectedDep)) {
      if (!isEmpty(currencyIds) && !isUndefined(selectedDep.currencies) && !oldCurSet) {
        setCurrencyIds(
          currencyIds.map((item) => {
            const isExist = !isUndefined(selectedDep.currencies.find((b) => b.id === item.id));
            if (isExist) {
              return { ...item, checked: true };
            }
            return item;
          }));
        setOldCurSet(true);
      }
    }
  }, [currencyIds, isMount, open, selectedDep, oldCurSet]);

  useEffect(() => {
    if (!isEmpty(currencyIds)) {
      let a = 0;
      for (let i = 0; i < currencyIds.length; i += 1) {
        if (currencyIds[i].checked) {
          a += 1;
        }
      }
      setAllCur(a === currencyIds.length);
    }
  }, [currencyIds]);

  useEffect(() => {
    if (isMount && !isEmpty(currencies) && !currencySetted) {
      for (let i = 0; i < currencies.length; i += 1) {
        setCurrencyIds((prevState) => ([
          ...prevState,
          { id: currencies[i].id, title: currencies[i].title, checked: false }
        ]));
      }
      setCurrencySetted(true);
    }
  }, [isMount, currencySetted, currencies]);

  const onClearAllData = useCallback(() => {
    setTitle('');
    setLimit('');
    setCityId('');
    setSalary('');
    setAddress('');
    setComment('');
    setFilialId('');
    setSchedule('');
    setIsActive('');
    setIsCentral('');
    setTokensArr([]);
    setCurrencyIds([]);
    setIsEditableRates('');
    setCurrencySetted(false);
  }, []);

  const onGetResponseCurrencies = useCallback((response) => {
    const { data } = response;
    setCurrencies(data);
  }, []);

  const { fetch: fetchCurrencies } = useFetch({
    requestFunction: CurrenciesService.getRequest,
    setResponse: onGetResponseCurrencies
  });

  useEffect(() => {
    if (isMount && open && isEmpty(currencies)) {
      fetchCurrencies({ date: moment().format('YYYY-MM-DD') });
    }
  }, [isMount, open, currencies, fetchCurrencies]);

  useEffect(() => {
    if (isEmpty(filials) && open) {
      fetchFilials();
    }
  }, [fetchFilials, open, filials]);

  useEffect(() => {
    if (isEmpty(cities) && open) {
      fetchCities();
    }
  }, [fetchCities, open, cities]);

  const onChangeTitle = useCallback((e) => setTitle(e.target.value), []);
  const onChangeLimit = useCallback((e) => setLimit(e.target.value), []);
  const onChangeCity = useCallback((e) => setCityId(e.target.value), []);
  const onChangeSalary = useCallback((e) => setSalary(e.target.value), []);
  const onChangeFilial = useCallback((e) => setFilialId(e.target.value), []);
  const onChangeAddress = useCallback((e) => setAddress(e.target.value), []);
  const onChangeComment = useCallback((e) => setComment(e.target.value), []);
  const onChangeActive = useCallback((e) => setIsActive(e.target.value), []);
  const onChangeCentral = useCallback((e) => setIsCentral(e.target.value), []);
  const onChangeEditRates = useCallback((e) => setIsEditableRates(e.target.value), []);
  const onChangeSchedule = useCallback((e) => setSchedule(e.target.value), []);

  const onClickCancel = useCallback(() => {
    onClearAllData();
    onClose();
    setOldCurSet(false);
  }, [onClose, onClearAllData]);

  const onGetResponse = useCallback((resp) => {
    const { data } = resp;
    updateDepartments({ id: data.id, data });
  }, [updateDepartments]);

  const { fetch: fetchNewDep } = useFetch({
    requestFunction: DepartmentsService.postRequest
  });

  const { fetch: fetchEditDep } = useFetch({
    requestFunction: DepartmentsService.putRequest,
    setResponse: onGetResponse
  });

  const onClickSubmit = useCallback(() => {
    const cur = [];
    const tokens = [];
    if (isEmpty(selectedDep)) {
      tokensArr.forEach((el) => tokens.push(el.inputValue));
    }
    if (!isEmpty(selectedDep)) {
      tokensArr.forEach((el) => tokens.push(el));
    }
    currencyIds.forEach((el) => el.checked && cur.push(el.id));
    const isValidData = title !== '' && cityId !== '' && address !== ''
      && salary !== '' && isCentral !== ''
      && isActive !== '' && !isUndefined(isEditableRates) && limit !== '' && schedule !== '';

    const sentComment = comment.length ? { comment } : {};
    const depData = {
      limit: Number(limit),
      title,
      salary,
      tokens,
      ...sentComment,
      currencies: cur,
      city_id: cityId,
      isEditableRates,
      addres: address,
      filial_id: filialId,
      isActive: Number(isActive),
      isCentral: Number(isCentral),
      approx_session_length: schedule
    };
    if (isValidData) {
      if (isEmpty(selectedDep)) {
        fetchNewDep(depData);
        fetchDepartments();
      }
      if (!isEmpty(selectedDep)) {
        fetchEditDep({ ...depData, id: selectedDep.id });
      }
      onClickCancel();
    }
  }, [
    fetchEditDep, selectedDep, schedule,
    fetchNewDep, fetchDepartments, onClickCancel,
    title, cityId, currencyIds, isCentral, filialId, salary,
    tokensArr, isEditableRates, limit, address, comment, isActive
  ]);

  const onChangeCurrencies = useCallback((e) => {
    const { name, checked, id } = e.target;
    const newArr = [{ id: Number(id), title: name, checked }];
    setCurrencyIds(
      currencyIds.map((item) => {
        if (item.id === Number(id)) {
          return deepmerge(item, ...newArr, {
            arrayMerge: combineMerge,
            isMergeableObject: isPlainObject
          });
        }
        return item;
      })
    );
  }, [currencyIds]);

  const onCheckAll = useCallback((e) => {
    setAllCur(e.target.checked);
    setCurrencyIds(
      currencyIds.map((item) => (
        deepmerge(item, ...[{ id: item.id, title: item.title, checked: e.target.checked }], {
          arrayMerge: combineMerge,
          isMergeableObject: isPlainObject
        })))
    );
  }, [currencyIds]);

  return (
    <ModalWindow
      open={open}
      maxWidth="700px"
      onClose={onClickCancel}
      onBackdropClick={onClickCancel}
    >
      <form>
        <div className="addUsers addDep">
          <FormControl size="small" fullWidth>
            <TextField
              required
              size="small"
              id="title"
              name="title"
              label="Название отделения"
              placeholder="Введите название отделения"
              value={title}
              onChange={onChangeTitle}
              error={title.length > 128}
              inputProps={{
                maxLength: 129
              }}
            />
            {title.length > 128 && <FormHelperText error>Не более 128 символов</FormHelperText>}
          </FormControl>
          <div className="addUsers-two">
            <FormControl size="small" fullWidth>
              <InputLabel>Выбрать филиал</InputLabel>
              <Select
                size="small"
                id="filial"
                name="filial"
                label="Выбрать филиал"
                placeholder="Выбрать филиал"
                value={filialId}
                onChange={onChangeFilial}
              >
                {filials.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Выбрать город *</InputLabel>
              <Select
                required
                size="small"
                id="city"
                name="city"
                label="Выбрать город"
                placeholder="Выбрать город"
                value={cityId}
                onChange={onChangeCity}
              >
                {cities.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <FormControl size="small" fullWidth>
            <TextField
              required
              size="small"
              id="address"
              label="Адрес"
              name="address"
              placeholder="Адрес"
              value={address}
              onChange={onChangeAddress}
            />
          </FormControl>
          <FormControl size="small" fullWidth>
            <TextField
              multiline
              rows={4}
              size="small"
              id="comment"
              name="comment"
              label="Комментарий"
              placeholder="Комментарий"
              value={comment}
              onChange={onChangeComment}
            />
          </FormControl>
          <FormControl size="small" fullWidth>
            <Autocomplete
              multiple
              value={tokensArr}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  setTokensArr({
                    token: newValue
                  });
                } else if (newValue && newValue.inputValue) {
                  setTokensArr({
                    token: newValue.inputValue
                  });
                } else {
                  setTokensArr(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some((option) => inputValue === option.token);
                if (inputValue !== '' && !isExisting && tokensArr.length < 2) {
                  filtered.push({
                    inputValue,
                    token: `Добавить токен "${inputValue}"`
                  });
                }

                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              size="small"
              handleHomeEndKeys
              id="free-solo-with-text-demo"
              options={[]}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.token;
              }}
              renderOption={(props, option) => <li {...props}>{option.token}</li>}
              freeSolo
              placeholder="Токен"
              label="Токен"
              renderInput={(params) => (
                <TextField {...params} placeholder="Токен" label="Токен" />
              )}
            />
          </FormControl>
          <div className="addUsers-two">
            <FormControl size="small" fullWidth>
              <TextField
                required
                size="small"
                id="zp"
                label="ЗП"
                name="zp"
                placeholder="ЗП"
                value={salary}
                onChange={onChangeSalary}
              />
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>График работы *</InputLabel>
              <Select
                required
                size="small"
                id="type"
                label="Тип отделения"
                name="type"
                placeholder="Тип отделения"
                value={schedule}
                onChange={onChangeSchedule}
              >
                <MenuItem value="08:00">8 часов</MenuItem>
                <MenuItem value="12:00">12 часов</MenuItem>
                <MenuItem value="24:00">24 часа</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="addUsers-two">
            <FormControl size="small" fullWidth>
              <InputLabel>Тип отделения *</InputLabel>
              <Select
                required
                size="small"
                id="type"
                label="Тип отделения"
                name="type"
                placeholder="Тип отделения"
                value={isCentral}
                onChange={onChangeCentral}
              >
                <MenuItem value={1}>Центральное</MenuItem>
                <MenuItem value={0}>Региональное</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Изменение курса *</InputLabel>
              <Select
                required
                size="small"
                id="changeRate"
                label="Изменение курса"
                name="changeRate"
                placeholder="Изменение курса"
                value={isEditableRates}
                onChange={onChangeEditRates}
              >
                <MenuItem value={1}>Разрешить</MenuItem>
                <MenuItem value={0}>Запретить</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="addUsers-two">
            <FormControl size="small" fullWidth>
              <InputLabel>Статус *</InputLabel>
              <Select
                required
                size="small"
                id="status"
                label="Статус"
                name="status"
                placeholder="Статус"
                value={isActive}
                onChange={onChangeActive}
              >
                <MenuItem value={1}>Активное</MenuItem>
                <MenuItem value={0}>Неактивное</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <TextField
                required
                InputProps={{ inputProps: { min: 0 } }}
                id="limit"
                size="small"
                name="limit"
                value={limit}
                type="number"
                label="Лимит кассы"
                onChange={onChangeLimit}
                placeholder="Лимит кассы"
              />
            </FormControl>
          </div>
          <FormControl size="small" fullWidth className="row">
            <FormControlLabel
              checked={allCur}
              label="Выбрать все"
              onChange={onCheckAll}
              control={<Checkbox size="small" />}
            />
            <div className="row">
              {!isEmpty(currencyIds) && currencyIds.map((item) => (
                <FormControlLabel
                  key={item.id}
                  name={item.title}
                  label={item.title}
                  checked={item.checked}
                  onChange={onChangeCurrencies}
                  control={<Checkbox id={String(item.id)} size="small" />}
                />
              ))}
            </div>
          </FormControl>
          <div className="addUsers-actions">
            <Button variant="contained" onClick={onClickSubmit}>Сохранить</Button>
            <Button onClick={onClickCancel}>Отмена</Button>
          </div>
        </div>
      </form>
    </ModalWindow>
  );
};

AddDepartments.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  selectedDep: PropTypes.object
};

export default AddDepartments;
