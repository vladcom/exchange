import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class RatesService extends CRUDService {
  constructor() {
    super(API_URLS.RATES);
  }
}

export default new RatesService();
