import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class CurrenciesService extends CRUDService {
  constructor() {
    super(API_URLS.CURRENCY);
  }
}

export default new CurrenciesService();
