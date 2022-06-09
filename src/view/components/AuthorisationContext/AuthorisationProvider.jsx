import React, { useState, useCallback } from 'react';

import { AuthorisationContext, defaultContext } from './authorisationContext';
import useFetch from '../../../hooks/useFetch';
import LogoutService from '../../../services/AUTH/LogoutService';

const AuthorisationProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('secret'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [cashierData, setCashierData] = useState(JSON.parse(localStorage.getItem('cashier')));
  const userRole = localStorage.getItem('role');

  const login = useCallback((tokenToSet) => {
    setToken(tokenToSet);
    localStorage.setItem('secret', tokenToSet);
  }, []);

  const updateUser = useCallback((data) => {
    const { role: { title } } = data;
    setUser(data);
    localStorage.setItem('role', title);
    localStorage.setItem('user', JSON.stringify(data));
  }, []);

  const updateCashier = useCallback((data) => {
    const { departments } = data;
    setCashierData(departments[0]);
    localStorage.setItem('cashier', JSON.stringify(departments[0]));
  }, []);

  const { fetch: fetchLogout } = useFetch({
    requestFunction: LogoutService.postRequest
  });

  const logout = useCallback(() => {
    fetchLogout();
    setToken(defaultContext.token);
    localStorage.removeItem('secret');
    localStorage.removeItem('user');
    localStorage.removeItem('cashier');
  }, [fetchLogout]);

  // useEffect(() => {
  //   if (token) {
  //     const { exp } = jwtDecode(token);
  //     if (!exp || exp < new Date().getTime()) {
  //       localStorage.removeItem('secret');
  //       logout();
  //     }
  //   }
  // }, [token, logout]);

  const contextData = {
    user,
    token,
    login,
    logout,
    userRole,
    updateUser,
    cashierData,
    updateCashier
  };

  if (children instanceof Function) {
    return children(contextData);
  }

  return (
    <AuthorisationContext.Provider value={contextData}>
      {children}
    </AuthorisationContext.Provider>
  );
};

export default AuthorisationProvider;
