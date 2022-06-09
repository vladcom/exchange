import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { AuthRoute } from './hocs';
import { AuthorisationProvider } from '../components/AuthorisationContext';
import LoginPage from '../pages/LoginPage/LoginPage';
import PrivateRoutes from './PrivateRoutes';
import RedirectRoute from './RedirectRoute';

const Routing = () => (
  <AuthorisationProvider>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <AuthRoute exact path="/auth" component={LoginPage} />
        <AuthRoute exact path="/auth/:token" component={RedirectRoute} />
        <Route path="/" component={PrivateRoutes} />
      </Switch>
    </BrowserRouter>
  </AuthorisationProvider>
);

export default Routing;
