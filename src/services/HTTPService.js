export default class HTTPService {
  static _instance;

  constructor() {
    if (HTTPService._instance) {
      // eslint-disable-next-line no-constructor-return
      return HTTPService._instance;
    }

    HTTPService._instance = this;
    // eslint-disable-next-line no-constructor-return
    return this;
  }

  static async fetch(method, url, options = {}, raw = false) {
    const { body, ...fetchOptions } = options;

    if (typeof body !== 'undefined') {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const authOptions = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      ...fetchOptions
    };

    const response = await fetch(process.env.REACT_APP_BASE_URL + url, authOptions);

    if (raw) {
      return response;
    }

    if (response.status === 401) {
      throw new Error('Not Authenticated!');
    }

    return response.json().catch(() => response);
  }

  static async authFetch(method, url, options = {}, raw = false) {
    const token = localStorage.getItem('secret');
    const { body, ...fetchOptions } = options;
    if (body instanceof FormData) {
      fetchOptions.body = options.body;
    } else if (typeof body !== 'undefined') {
      fetchOptions.body = JSON.stringify(options.body);
      fetchOptions.headers = { 'Content-Type': 'application/json' };
    }

    const authOptions = {
      method,
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${token}`,
        'X-XSS-Protection': '1; mode=block',
        'X-Frame-Options': 'DENY'
      }
    };

    const response = await fetch(process.env.REACT_APP_BASE_URL + url, authOptions);
    if (raw) {
      return response;
    }

    if (response.status === 401) {
      localStorage.removeItem('secret');
      throw new Error('Not Authenticated!');
    }
    if (method === 'PATCH') {
      return response;
    }
    if (response.status === 201) {
      return response.json().catch(() => response);
    }
    return response.json().catch(() => response);
  }

  // eslint-disable-next-line class-methods-use-this
  apiGet = (...args) => HTTPService.authFetch('GET', ...args);

  // eslint-disable-next-line class-methods-use-this
  apiPut = (...args) => HTTPService.authFetch('PUT', ...args);

  // eslint-disable-next-line class-methods-use-this
  apiPost = (...args) => HTTPService.authFetch('POST', ...args);

  // eslint-disable-next-line class-methods-use-this
  apiPatch = (...args) => HTTPService.authFetch('PATCH', ...args);

  // eslint-disable-next-line class-methods-use-this
  apiDelete = (...args) => HTTPService.authFetch('DELETE', ...args);

  // eslint-disable-next-line class-methods-use-this
  apiPostPublic = (...args) => HTTPService.fetch('POST', ...args);
}
