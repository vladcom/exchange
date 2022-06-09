import { useState, useRef, useCallback } from 'react';
import _memoize from 'lodash.memoize';
import useIsMounted from './useIsMounted';

const checkResponseForError = async (response) => {
  if (response && response.success === true) {
    throw response;
  }
};

/**
 * useFetch hook for fetching data
 * @param {Function} requestFunction
 * @param {boolean} [withCache]
 * @param {boolean} [withLoading]
 * @param {Function} [formatResponse]
 * @param {Function} [setResponse]
 * @param {Function} [setError]
 * @param {boolean} [initialLoading]
 * @return {{loading: boolean, fetch: function}}
 */
const useFetch = ({
  setError,
  setResponse,
  formatResponse,
  requestFunction,
  withCache = false,
  withLoading = false,
  initialLoading = false
}) => {
  const isMounted = useIsMounted();
  const cache = useRef({});
  const [loading, setLoading] = useState(initialLoading);
  const getCacheKey = _memoize((data) => JSON.stringify(data));
  const setResponseWrapper = useCallback((response) => {
    if (!isMounted || !setResponse) { return void 0; }

    setResponse(formatResponse ? formatResponse(response) : response);
  }, [setResponse, formatResponse, isMounted]);
  const setErrorWrapper = useCallback((response) => {
    if (!isMounted.current || !setError) { return void 0; }

    setError(response);
  }, [setError, isMounted]);
  const setLoadingWrapper = useCallback((status) => {
    if (!isMounted.current || !withLoading) { return void 0; }

    setLoading(status);
  }, [setLoading, withLoading, isMounted]);

  const fetch = useCallback(async (params) => {
    if (withCache && cache.current[getCacheKey(params)]) {
      const response = cache.current[getCacheKey(params)];

      setResponseWrapper(response);

      return { response };
    }

    setLoadingWrapper(true);

    try {
      const response = await requestFunction(params);

      if (!isMounted.current) { return void 0; }

      await checkResponseForError(response);

      if (withCache) {
        cache.current[getCacheKey(params)] = response;
      }

      setResponseWrapper(response);

      return { response: formatResponse ? formatResponse(response) : response };
    } catch (error) {
      setErrorWrapper(error);

      return { error };
    } finally {
      setLoadingWrapper(false);
    }
  }, [
    withCache,
    isMounted,
    getCacheKey,
    formatResponse,
    requestFunction,
    setErrorWrapper,
    setLoadingWrapper,
    setResponseWrapper
  ]);

  return { loading, fetch, setErrorWrapper };
};

export default useFetch;
