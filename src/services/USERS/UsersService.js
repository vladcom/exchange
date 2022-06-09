import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class UsersService extends CRUDService {
  constructor() {
    super(API_URLS.USERS);
  }
}

export default new UsersService();
