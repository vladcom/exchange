import React from 'react';
import PropTypes from 'prop-types';
import deepmerge from 'deepmerge';
import { withRouter } from 'react-router-dom';
import { isPlainObject } from 'is-plain-object';
import { DashboardContext } from './DashboardContext';
import UsersService from '../../../services/USERS/UsersService';
import CitiesService from '../../../services/CITIES/CitiesService';
import RolesService from '../../../services/ROLES/RolesService';
import FilialService from '../../../services/FILIAL/FilialService';
import DepartmentsService from '../../../services/DEPARTMENTS/DepartmentsService';
import CurrenciesService from '../../../services/CURRENCIES/CurrenciesService';
import combineMerge from '../../../utils/combineMerge';

class DashboardProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roles: [],
      users: [],
      zoDep: [],
      cities: [],
      filials: [],
      currency: [],
      departments: [],
      selectedUser: {},
      usersCount: null,
      isCoFetched: false,
      isFetchingUser: false,
      isUserUpdating: false,
      departmentsCount: null,
      isFetchingUsers: false,
      isFetchingRoles: false,
      isFetchingCities: false,
      isFetchingFilials: false,
      isFetchingCurrencies: false,
      isFetchingDepartments: false
    };
  }

  fetchRoles = async () => {
    try {
      this.setState({
        isFetchingRoles: true
      });
      const response = await RolesService.getRequest();
      if (response.data) {
        this.setState({
          roles: response.data,
          isFetchingRoles: true
        });
      }
      if (!response.data) {
        this.setState({
          roles: [],
          isFetchingRoles: false
        });
      }
    } catch {
      this.setState({
        roles: [],
        isFetchingRoles: false
      });
    }
  };

  fetchCities = async () => {
    try {
      this.setState({
        isFetchingCities: true
      });
      const response = await CitiesService.getRequest();
      if (response.data) {
        this.setState({
          cities: response.data,
          isFetchingCities: true
        });
      }
      if (!response.data) {
        this.setState({
          cities: [],
          isFetchingCities: false
        });
      }
    } catch {
      this.setState({
        cities: [],
        isFetchingCities: false
      });
    }
  };

  fetchFilials = async () => {
    try {
      this.setState({
        isFetchingFilials: true
      });
      const response = await FilialService.getRequest();
      if (response.data) {
        this.setState({
          filials: response.data,
          isFetchingFilials: true
        });
      }
      if (!response.data) {
        this.setState({
          filials: [],
          isFetchingFilials: false
        });
      }
    } catch {
      this.setState({
        filials: [],
        isFetchingFilials: false
      });
    }
  };

  fetchDepartments = async (data) => {
    try {
      this.setState({
        isFetchingDepartments: true
      });
      const response = await DepartmentsService.getRequest(data);
      if (response.data) {
        this.setState({
          departments: response.data,
          isFetchingDepartments: true,
          departmentsCount: response.meta.total
        });
      }
      if (!response.data) {
        this.setState({
          departments: [],
          isFetchingDepartments: false
        });
      }
    } catch {
      this.setState({
        departments: [],
        isFetchingDepartments: false
      });
    }
  };

  fetchZoDepart = async () => {
    try {
      const response = await DepartmentsService.getRequest({ isCentral: 1, page: 1, per_page: 100 });
      if (response.data) {
        this.setState({
          zoDep: response.data,
          isCoFetched: true
        });
      }
      if (!response.data) {
        this.setState({ zoDep: [] });
      }
    } catch {
      this.setState({ zoDep: [] });
    }
  };

  fetchUsers = async (data) => {
    try {
      this.setState({
        isFetchingUsers: true
      });
      const response = await UsersService.getRequest(data);
      if (response.data) {
        this.setState({
          users: response.data,
          usersCount: response.meta.total,
          isFetchingUsers: true
        });
      }
      if (!response.data) {
        this.setState({
          users: [],
          isFetchingUsers: false
        });
      }
    } catch {
      this.setState({
        users: [],
        isFetchingUsers: false
      });
    }
  };

  fetchCurrencies = async ({ date }) => {
    try {
      this.setState({
        isFetchingCurrencies: true
      });
      const response = await CurrenciesService.getRequest({ date });
      if (response.data) {
        this.setState({
          currency: response.data,
          isFetchingCurrencies: true
        });
      }
      if (!response.data) {
        this.setState({
          currency: [],
          isFetchingCurrencies: false
        });
      }
    } catch {
      this.setState({
        currency: [],
        isFetchingCurrencies: false
      });
    }
  };

  fetchSelectedUser = async (data) => {
    try {
      this.setState({ isFetchingUser: true });
      const response = await UsersService.getRequestWithID(data);
      this.setState({
        selectedUser: response.data,
        isFetchingUser: false
      });
    } catch {
      this.setState({ isFetchingUser: false });
    }
  };

  updateDepartments = async ({ id, data }) => {
    this.setState((prevState) => ({
      departments: prevState.departments.map((dep) => {
        if (dep.id === id) {
          return deepmerge(dep, data, {
            arrayMerge: combineMerge,
            isMergeableObject: isPlainObject
          });
        }
        return dep;
      })
    }));
  };

  updateSelectedUser = async (data) => {
    try {
      this.setState({ isUserUpdating: true });
      this.setState({
        selectedUser: data
      });
    } catch {
      this.setState({ isUserUpdating: false });
    }
  };

  getProviderValues = () => {
    const {
      roles,
      users,
      zoDep,
      cities,
      filials,
      currency,
      usersCount,
      isCoFetched,
      departments,
      selectedUser,
      isFetchingUser,
      isUserUpdating,
      isFetchingUsers,
      isFetchingRoles,
      departmentsCount,
      isFetchingCities,
      isFetchingFilials,
      isFetchingCurrencies,
      isFetchingDepartments
    } = this.state;
    return {
      roles,
      users,
      zoDep,
      cities,
      filials,
      currency,
      usersCount,
      departments,
      isCoFetched,
      selectedUser,
      isFetchingUser,
      isUserUpdating,
      isFetchingRoles,
      isFetchingUsers,
      departmentsCount,
      isFetchingCities,
      isFetchingFilials,
      isFetchingCurrencies,
      isFetchingDepartments,
      fetchRoles: this.fetchRoles,
      fetchUsers: this.fetchUsers,
      fetchCities: this.fetchCities,
      fetchFilials: this.fetchFilials,
      fetchZoDepart: this.fetchZoDepart,
      fetchCurrencies: this.fetchCurrencies,
      fetchDepartments: this.fetchDepartments,
      updateDepartments: this.updateDepartments,
      fetchSelectedUser: this.fetchSelectedUser,
      updateSelectedUser: this.updateSelectedUser
    };
  };

  render() {
    const { children } = this.props;
    return (
      <DashboardContext.Provider value={this.getProviderValues()}>
        {children}
      </DashboardContext.Provider>
    );
  }
}

DashboardProvider.propTypes = {
  children: PropTypes.object
};

export default withRouter(DashboardProvider);
