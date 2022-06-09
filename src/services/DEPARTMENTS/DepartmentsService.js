import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class DepartmentsService extends CRUDService {
  constructor() {
    super(API_URLS.DEPARTMENTS);
  }
}

export default new DepartmentsService();
