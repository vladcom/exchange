import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class LogoutService extends CRUDService {
  constructor() {
    super(API_URLS.LOGOUT);
  }
}

export default new LogoutService();
