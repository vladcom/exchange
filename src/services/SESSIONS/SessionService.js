import { API_URLS } from '../../constants/urls';
import CRUDService from '../CRUDService';

class SessionService extends CRUDService {
  constructor() {
    super(API_URLS.SESSIONS);
  }
}

export default new SessionService();
