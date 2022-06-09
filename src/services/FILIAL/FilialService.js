import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class FilialService extends CRUDService {
  constructor() {
    super(API_URLS.FILIAL);
  }
}

export default new FilialService();
