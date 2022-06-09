import React, { useCallback, useContext, useEffect, useState } from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import { nanoid } from 'nanoid';
import { DashboardContext } from '../DashboardContext';
import ModalWindow from '../ModalWindow/ModalWindow';
import useFetch from '../../../hooks/useFetch';
import UsersService from '../../../services/USERS/UsersService';
import validationSchemaNewUser from './validateForm';
import { isNull } from '../../../utils/isNull';
import { isUndefined } from '../../../utils/isUndefined';
import useIsMounted from '../../../hooks/useIsMounted';
import { AuthorisationContext } from '../AuthorisationContext';

const AddUser = ({ open, isEdit, isSelfEdit, handleClose }) => {
  const isMounted = useIsMounted();
  const {
    roles,
    cities,
    fetchRoles,
    fetchCities,
    selectedUser,
    updateSelectedUser
  } = useContext(DashboardContext);
  const { user, userRole, updateUser } = useContext(AuthorisationContext);
  const [errorMessage, setErrorMessage] = useState({});
  const [citiesUserIds, setCitiesUserIds] = useState([]);
  const [isDataSetted, setIsDataSetted] = useState(false);
  const [userData, setUserData] = useState({});
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const isAdmin = userRole === 'Администратор';

  useEffect(() => {
    if (isEdit && isEmpty(userData) && !isSelfEdit) {
      setUserData(selectedUser);
    }
  }, [isEdit, userData, isSelfEdit, selectedUser]);

  useEffect(() => {
    if (isEdit && isEmpty(userData) && isSelfEdit) {
      setUserData(user);
    }
  }, [isEdit, user, userData, isSelfEdit, selectedUser]);

  useEffect(() => () => {
    setUserData({});
  }, []);

  useEffect(() => {
    if (isEmpty(citiesUserIds)) {
      if (!isUndefined(userData) && !isUndefined(cities)) {
        if (!isUndefined(userData.cities)) {
          userData.cities.map((i) => setCitiesUserIds((prevState) => ([
            ...prevState,
            i.id
          ])));
        }
      }
    }
  }, [cities, userData, citiesUserIds]);

  const onGetResponse = useCallback((response) => {
    if (response.data) {
      if (isEmpty(userData)) {
        handleClose();
      }
      if (!isEmpty(userData)) {
        setIsDataUpdated(true);
        updateSelectedUser(response.data);
        setIsDataSetted(true);
        setUserData(response.data);
        if (isSelfEdit) {
          updateUser(response.data);
        }
        handleClose();
        window.location.reload();
      }
    }
    if (!response.success) {
      setErrorMessage({});
    }
  }, [userData, isSelfEdit, updateUser, handleClose, updateSelectedUser]);

  const { fetch: fetchAddUser, loading: isFetchingNewUser } = useFetch({
    requestFunction: UsersService.postRequest,
    setResponse: onGetResponse,
    withLoading: true
  });

  const { fetch: fetchEditUser, loading: isFetchingEditUser } = useFetch({
    requestFunction: UsersService.putRequest,
    setResponse: onGetResponse,
    withLoading: true
  });

  const onSubmitForm = useCallback((value) => {
    const {
      dob,
      phone,
      login,
      access,
      status,
      cityIds,
      userType,
      telegram,
      password,
      lastname,
      firstname,
      patronymic,
      confirmPassword,
      additionalContact
    } = value;
    if (isEmpty(userData)) {
      fetchAddUser({
        dob,
        phone,
        login,
        access,
        status,
        password,
        lastname,
        firstname,
        patronymic,
        role_id: userType,
        city_ids: [...cityIds],
        telegram_chat_id: telegram,
        additional_contact: additionalContact,
        password_confirmation: confirmPassword
      });
    }
    if (!isEmpty(userData)) {
      fetchEditUser({
        dob,
        phone,
        login,
        access,
        status,
        lastname,
        firstname,
        patronymic,
        id: userData.id,
        role_id: userType,
        city_ids: [...cityIds],
        telegram_chat_id: telegram,
        additional_contact: additionalContact
      });
    }
  }, [fetchAddUser, fetchEditUser, userData]);

  const formik = useFormik({
    initialValues: {
      dob: '',
      login: '',
      phone: '',
      status: '',
      access: '',
      cityIds: [],
      userType: '',
      telegram: '',
      password: '',
      lastname: '',
      firstname: '',
      patronymic: '',
      confirmPassword: '',
      additionalContact: ''
    },
    validationSchema: validationSchemaNewUser,
    onSubmit: (values, { resetForm }) => {
      onSubmitForm(values);
      resetForm();
    }
  });

  useEffect(() => {
    if (isMounted.current) {
      if (!isEmpty(citiesUserIds)) {
        if (isEmpty(formik.values.cityIds)) {
          formik.values.cityIds = [...citiesUserIds];
        }
      }
    }
  }, [formik, isMounted, citiesUserIds]);

  useEffect(() => {
    if (isMounted.current) {
      if (!isEmpty(userData) && !isDataSetted) {
        setIsDataSetted(true);

        if (isEmpty(formik.values.firstname)) {
          formik.values.firstname = userData.firstname;
        }
        if (isEmpty(formik.values.lastname)) {
          formik.values.lastname = userData.lastname;
        }
        if (isEmpty(formik.values.patronymic)) {
          formik.values.patronymic = userData.patronymic;
        }
        if (isEmpty(formik.values.dob)) {
          formik.values.dob = !isNull(userData.dob) ? userData.dob : '';
        }
        if (isEmpty(formik.values.telegram)) {
          formik.values.telegram = userData?.telegram_chat_id;
        }
        if (isEmpty(formik.values.additionalContact)) {
          formik.values.additionalContact = !isNull(userData?.additional_contact) ? userData?.additional_contact : '';
        }
        if (isEmpty(formik.values.access)) {
          formik.values.access = Number(userData.access);
        }
        if (isEmpty(formik.values.status)) {
          formik.values.status = Number(userData.status);
        }
        if (isEmpty(formik.values.phone)) {
          formik.values.phone = userData.phone;
        }
        if (isEmpty(formik.values.userType)) {
          formik.values.userType = userData.role.id;
        }
        if (isEmpty(formik.values.login)) {
          formik.values.login = userData.login;
        }
      }
    }
  }, [formik, userData, isDataUpdated, isDataSetted, isMounted]);

  useEffect(() => {
    if (isEmpty(cities)) {
      fetchCities();
    }
  }, [cities, fetchCities]);

  useEffect(() => {
    if (isEmpty(roles)) {
      fetchRoles();
    }
  }, [roles, fetchRoles]);

  const renderErrors = useCallback(() => {
    if (!isEmpty(errorMessage)) {
      return errorMessage.map((item) => <p key={nanoid()} className="errorText">{item}</p>);
    }
  }, [errorMessage]);

  const onClickReset = () => {
    formik.resetForm();
    handleClose();
    setErrorMessage({});
  };

  return (
    <ModalWindow
      open={open}
      maxWidth="700px"
      onClose={handleClose}
    >
      <div className="addUsers">
        <form onSubmit={formik.handleSubmit}>
          <FormControl size="small" fullWidth>
            <TextField
              required
              size="small"
              id="lastname"
              label="Фамилия"
              name="lastname"
              disabled={!isAdmin}
              placeholder="Фамилия"
              value={formik.values.lastname}
              onChange={formik.handleChange}
              error={formik.touched.lastname && Boolean(formik.errors.lastname)}
            />
            {(formik.touched.lastname && formik.errors.lastname) && (
              <FormHelperText error>{formik.errors.lastname}</FormHelperText>)}
          </FormControl>
          <FormControl fullWidth size="small">
            <TextField
              required
              label="Имя"
              size="small"
              id="firstname"
              name="firstname"
              placeholder="Имя"
              onChange={formik.handleChange}
              value={formik.values.firstname}
              error={formik.touched.firstname && Boolean(formik.errors.firstname)}
            />
            {(formik.touched.firstname && formik.errors.firstname) && (
              <FormHelperText error>{formik.errors.firstname}</FormHelperText>)}
          </FormControl>
          <FormControl fullWidth size="small">
            <TextField
              required
              size="small"
              id="patronymic"
              label="Отчетство"
              name="patronymic"
              placeholder="Отчетство"
              onChange={formik.handleChange}
              value={formik.values.patronymic}
              error={formik.touched.patronymic && Boolean(formik.errors.patronymic)}
            />
            {(formik.touched.firstname && formik.errors.patronymic) && (
              <FormHelperText error>{formik.errors.patronymic}</FormHelperText>)}
          </FormControl>
          <div className="addUsers-two">
            <FormControl fullWidth size="small">
              <LocalizationProvider dateAdapter={MomentUtils}>
                <DatePicker
                  required
                  id="dob"
                  name="dob"
                  openTo="year"
                  disableMaskedInput
                  label="Дата рождения *"
                  value={formik.values.dob}
                  placeholder="Дата рождения"
                  minDate={moment('1930-01-01')}
                  maxDate={moment().subtract(18, 'y')}
                  onChange={(value) => !isNull(value) && formik.setFieldValue('dob', moment(value).format('YYYY-MM-DD'))}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      mask="YYYY-DD-MM"
                      error={formik.touched.dob && Boolean(formik.errors.dob)}
                    />
                  )}
                />
              </LocalizationProvider>
              {(formik.touched.dob && formik.errors.dob) && (
                <FormHelperText error>{formik.errors.dob}</FormHelperText>)}
            </FormControl>
            <FormControl fullWidth size="small">
              <TextField
                size="small"
                id="telegram"
                name="telegram"
                label="Telegram"
                placeholder="Телеграм"
                value={formik.values.telegram || userData?.telegram_chat_id}
                onChange={formik.handleChange}
                error={formik.touched.telegram && Boolean(formik.errors.telegram)}
              />
              {(formik.touched.telegram && formik.errors.telegram) && (
                <FormHelperText error>{formik.errors.telegram}</FormHelperText>)}
            </FormControl>
          </div>
          <div className="addUsers-two">
            <FormControl fullWidth size="small">
              <TextField
                required
                id="phone"
                size="small"
                name="phone"
                label="Номер телефона"
                placeholder="Телефон"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </FormControl>
            <FormControl fullWidth size="small">
              <TextField
                size="small"
                id="additionalContact"
                name="additionalContact"
                onChange={formik.handleChange}
                label="Дополнительный способ связи"
                value={formik.values.additionalContact}
                placeholder="Дополнительный способ связи"
                error={formik.touched.additionalContact && Boolean(formik.errors.phone)}
              />
              {(formik.touched.additionalContact && formik.errors.additionalContact) && (
                <FormHelperText error>{formik.errors.additionalContact}</FormHelperText>)}
            </FormControl>
          </div>
          <div className="addUsers-two">
            <FormControl fullWidth size="small">
              <InputLabel>Тип пользователя *</InputLabel>
              <Select
                required
                size="small"
                id="userType"
                name="userType"
                disabled={!isAdmin}
                label="Тип пользователя"
                value={formik.values.userType}
                onChange={formik.handleChange}
                placeholder="Выбрать тип пользователя"
                error={formik.touched.userType && Boolean(formik.errors.userType)}
              >
                {roles.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                ))}
              </Select>
              {(formik.touched.userType && formik.errors.userType) && (
                <FormHelperText error>{formik.errors.userType}</FormHelperText>)}
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Город  *</InputLabel>
              <Select
                required
                multiple
                size="small"
                id="cityIds"
                label="Город"
                name="cityIds"
                disabled={!isAdmin}
                placeholder="Выбрать город"
                value={formik.values.cityIds}
                onChange={formik.handleChange}
                error={formik.touched.cityIds && Boolean(formik.errors.cityIds)}
              >
                {cities.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {(formik.touched.cityIds && formik.errors.cityIds) && (
              <FormHelperText error>{formik.errors.cityIds}</FormHelperText>)}
          </div>
          <div className="addUsers-two">
            <FormControl fullWidth size="small">
              <InputLabel>Доступ *</InputLabel>
              <Select
                required
                id="access"
                size="small"
                name="access"
                label="Доступ"
                disabled={!isAdmin}
                placeholder="Доступ"
                value={formik.values.access}
                onChange={(e) => {
                  const { value } = e.target;
                  if (value === 1) {
                    formik.values.status = 1;
                  }
                  if (value === 0) {
                    formik.values.status = 0;
                  }
                  formik.handleChange(e);
                }}
                error={formik.touched.access && Boolean(formik.errors.access)}
              >
                <MenuItem value={1}>Разрешить</MenuItem>
                <MenuItem value={0}>Запретить</MenuItem>
              </Select>
              {(formik.touched.access && formik.errors.access) && (
                <FormHelperText error>{formik.errors.access}</FormHelperText>)}
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Статус *</InputLabel>
              <Select
                required
                id="status"
                size="small"
                name="status"
                label="Статус"
                disabled={!isAdmin}
                placeholder="Статус"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <MenuItem value={1}>Активный</MenuItem>
                <MenuItem value={0}>Неактивный</MenuItem>
              </Select>
              {(formik.touched.status && formik.errors.status) && (
                <FormHelperText error>{formik.errors.status}</FormHelperText>)}
            </FormControl>
          </div>
          <FormControl fullWidth size="small">
            <TextField
              required
              id="login"
              size="small"
              name="login"
              disabled={!isAdmin}
              label="Логин пользователя"
              placeholder="Введите логин"
              value={formik.values.login}
              onChange={formik.handleChange}
              error={formik.touched.login && Boolean(formik.errors.login)}
            />
            {(formik.touched.login && formik.errors.login) && (
              <FormHelperText error>{formik.errors.login}</FormHelperText>)}
          </FormControl>
          <FormControl fullWidth size="small">
            <TextField
              size="small"
              id="password"
              label="Пароль"
              name="password"
              disabled={!isAdmin}
              placeholder="Введите пароль"
              required={isEmpty(userData)}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
            {(formik.touched.password && formik.errors.password) && (
              <FormHelperText error>{formik.errors.password}</FormHelperText>)}
          </FormControl>
          <FormControl fullWidth size="small">
            <TextField
              size="small"
              disabled={!isAdmin}
              id="confirmPassword"
              name="confirmPassword"
              label="Подтвердить пароль"
              required={isEmpty(userData)}
              onChange={formik.handleChange}
              placeholder="Подтвердите пароль"
              value={formik.values.confirmPassword}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            />
            {(formik.touched.confirmPassword && formik.errors.confirmPassword) && (
              <FormHelperText error>{formik.errors.confirmPassword}</FormHelperText>)}
          </FormControl>
          {renderErrors()}
          <div className="addUsers-actions">
            <Button variant="contained" type="submit">{!isFetchingNewUser || !isFetchingEditUser ? 'Сохранить' : <CircularProgress /> }</Button>
            <Button type="reset" onClick={onClickReset}>Отмена</Button>
          </div>
        </form>
      </div>
    </ModalWindow>
  );
};

AddUser.propTypes = {
  open: PropTypes.bool,
  isEdit: PropTypes.bool,
  isSelfEdit: PropTypes.bool,
  handleClose: PropTypes.func
};

export default AddUser;
