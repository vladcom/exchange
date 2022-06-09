import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class LoginService extends CRUDService {
  constructor() {
    super(API_URLS.LOGIN);
  }
}

export default new LoginService();
