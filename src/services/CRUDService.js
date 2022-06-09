import HTTPService from './HTTPService';
import { addParamsToUrl } from '../utils/helpers';

export default class CRUDService {
  APIService = new HTTPService();

  constructor(pathname) {
    this.pathname = pathname;
  }

  delete = async (params) => this.APIService.apiDelete(addParamsToUrl(`${this.pathname}/${params.id}`, params));

  update = async (body) => this.APIService.apiPatch(this.pathname, { body });

  putRequest = async (body) => this.APIService.apiPut(`${this.pathname}/${body.id}`, { body });

  putRequestForBalance = async (body) => this.APIService.apiPut(`${this.pathname}/department/${body.departmentId}/${body.currencyId}`, { body });

  putWithoutIdRequest = async (body) => this.APIService.apiPut(this.pathname, { body });

  getRequest = async (params) => this.APIService.apiGet(addParamsToUrl(this.pathname, params));

  getRequestWithID = async (params) => this.APIService.apiGet(addParamsToUrl(`${this.pathname}/${params.id}`, params));

  postRequest = async (body) => this.APIService.apiPost(this.pathname, { body });

  postPublicRequest = async (body) => this.APIService.apiPostPublic(this.pathname, { body });
}
