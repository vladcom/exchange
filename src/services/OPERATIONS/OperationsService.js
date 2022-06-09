import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class OperationsService extends CRUDService {
  constructor() {
    super(API_URLS.OPERATIONS);
  }
}

export default new OperationsService();
