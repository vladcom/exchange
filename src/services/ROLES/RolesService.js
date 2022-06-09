import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class RolesService extends CRUDService {
  constructor() {
    super(API_URLS.ROLES);
  }
}

export default new RolesService();
