import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class CitiesService extends CRUDService {
  constructor() {
    super(API_URLS.CITIES);
  }
}

export default new CitiesService();
