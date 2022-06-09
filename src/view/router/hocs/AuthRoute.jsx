import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AuthorisationContext } from '../../components/AuthorisationContext';

const AuthRoute = ({ component: Component, ...rest }) => {
  const { token } = useContext(AuthorisationContext);

  return <Route {...rest} render={(props) => (token ? (<Redirect to="/" />) : (<Component {...props} />))} />;
};

AuthRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ])
};

export default AuthRoute;
