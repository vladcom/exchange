import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class BalancesService extends CRUDService {
  constructor() {
    super(API_URLS.BALANCE);
  }
}

export default new BalancesService();
