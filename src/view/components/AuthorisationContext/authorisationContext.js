import React from 'react';

export const defaultContext = {
  token: null,
  login: () => {},
  logout: () => {}
};

export const AuthorisationContext = React.createContext(defaultContext);
