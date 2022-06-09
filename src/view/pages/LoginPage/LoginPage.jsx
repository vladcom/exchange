import React, { useCallback, useContext, useState } from 'react';
import './style.scss';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import LoginService from '../../../services/AUTH/LoginService';
import { AuthorisationContext } from '../../components/AuthorisationContext';
import { isNull } from '../../../utils/isNull';
import { isUndefined } from '../../../utils/isUndefined';

const LoginPage = () => {
  const history = useHistory();
  const location = useLocation();
  const { token: pcToken } = location.state || false;
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorCashierLogin, setErrorCashierLogin] = useState(false);
  const {
    logout,
    updateUser,
    updateCashier,
    login: setToken
  } = useContext(AuthorisationContext);

  const onGetResponse = useCallback((resp) => {
    if (resp.data) {
      const { token, userData } = resp.data;
      if (token === 0) {
        return setErrorCashierLogin(true);
      }
      if (!userData.access) {
        logout();
      }
      if (token !== 0 && userData.access) {
        if (!isUndefined(resp.data.departments)) {
          updateCashier(resp.data);
          setErrorCashierLogin(false);
        }
        setToken(token);
        updateUser(userData);
        setErrorCashierLogin(false);
        history.push('/');
      }
    }
  }, [setToken, logout, updateCashier, history, updateUser]);

  const { fetch: fetchLogin, loading: isFetchingLogin } = useFetch({
    requestFunction: LoginService.postRequest,
    withLoading: true,
    setResponse: onGetResponse
  });

  const onClickSubmit = useCallback(() => {
    if (login.length && password.length) {
      setErrorCashierLogin(false);
      const isToken = !isNull(pcToken) ? { pc_token: pcToken } : {};
      fetchLogin({
        login,
        password,
        ...isToken
      });
    }
  }, [login, pcToken, password, fetchLogin]);

  return (
    <div className="login">
      <div className="login-container">
        <p className="login-container-title">Страница авторизации</p>
        <p className="login-container-subTitle">Введите свои данные</p>
        <div className="login-container-form">
          <TextField
            fullWidth
            value={login}
            variant="outlined"
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Логин"
          />
          <TextField
            fullWidth
            value={password}
            type="password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
          />
          <Button
            fullWidth
            variant="contained"
            onClick={onClickSubmit}
            disabled={isFetchingLogin}
          >
            {!isFetchingLogin ? 'Войти' : <CircularProgress style={{ width: '20px', height: '20px', color: 'white' }} />}
          </Button>
        </div>
        {errorCashierLogin
          ? (
            <div className="login-container-error">
              <p className="errorText">{`Ваш токен: ${pcToken}. Обратитесь к администратору`}</p>
            </div>
          )
          : null}
      </div>
    </div>
  );
};

export default LoginPage;
