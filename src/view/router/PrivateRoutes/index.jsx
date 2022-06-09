import React from 'react';
import Header from '../../components/Header/Header';
import HomePage from '../../pages/HomePage/HomePage';
import { PrivateRoute } from '../hocs';
import SideBar from '../../components/SideBar/SideBar';
import Profile from '../../pages/Profile/Profile';
import Settings from '../../pages/Settings/Settings';
import Users from '../../pages/Users/Users';
import { DashboardProvider } from '../../components/DashboardContext';
import { CashierProvider } from '../../components/CashierContext';
import UserPage from '../../pages/Users/UserPage/UserPage';
import Cities from '../../pages/AdminSettings/Cities/Cities';
import Filials from '../../pages/AdminSettings/Filials/Filials';
import Department from '../../pages/AdminSettings/Department/Department';
import Currency from '../../pages/AdminSettings/Currency/Currency';
import BuyAndSellPage from '../../pages/BuyAndSellPage/BuyAndSellPage';
import CrossCoursePage from '../../pages/CrossCoursePage/CrossCoursePage';
import DepartmentBalance from '../../pages/AdminSettings/Department/DepartmentBalance';

const PrivateRoutes = () => (
  <DashboardProvider>
    <CashierProvider>
      <div style={{ padding: '0 20px', height: '100%' }}>
        <Header />
        <div className="dashboard">
          <SideBar />
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/settings" component={Settings} />
          <PrivateRoute exact path="/currency" component={Currency} />
          <PrivateRoute exact path="/settings/users" component={Users} />
          <PrivateRoute exact path="/settings/users/:id" component={UserPage} />
          <PrivateRoute exact path="/settings/cities" component={Cities} />
          <PrivateRoute exact path="/settings/filials" component={Filials} />
          <PrivateRoute exact path="/settings/departments" component={Department} />
          <PrivateRoute exact path="/settings/departments/:id" component={DepartmentBalance} />
          <PrivateRoute exact path="/cashier-buy">
            <BuyAndSellPage isBuy />
          </PrivateRoute>
          <PrivateRoute exact path="/cashier-sell">
            <BuyAndSellPage />
          </PrivateRoute>
          <PrivateRoute exact path="/cashier-cross-course" component={CrossCoursePage} />
        </div>
      </div>
    </CashierProvider>
  </DashboardProvider>
);

export default PrivateRoutes;
