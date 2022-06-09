import React, { useCallback, useState } from 'react';

import { CashierContext } from './cashierContext';
import SessionService from '../../../services/SESSIONS/SessionService';
import RatesService from '../../../services/RATES/RatesService';
import OperationsService from '../../../services/OPERATIONS/OperationsService';

const CashierProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId'));
  const [sessionData, setSessionData] = useState(JSON.parse(localStorage.getItem('sessionOpened')));
  const [isSessionFetching, setIsSessionFetching] = useState(false);
  const [cashierCurrency, setCashierCurrency] = useState([]);
  const [cashierCurrencyFetching, setCashierCurrencyFetching] = useState(false);
  const [isFetchingSell, setIsFetchingSell] = useState(false);

  const fetchCashierCurrency = useCallback(async (data) => {
    try {
      setCashierCurrencyFetching(true);
      const response = await RatesService.getRequestWithID(data);
      if (!response.message) {
        setCashierCurrency(response.data);
      }
      setCashierCurrencyFetching(false);
    } catch {
      setCashierCurrency([]);
      setCashierCurrencyFetching(false);
    }
  }, []);

  const fetchStartSession = useCallback(async (data) => {
    try {
      setIsSessionFetching(true);
      const response = await SessionService.postRequest(data);
      if (!response.message) {
        setSessionData(response.data);
        setSessionId(response.data.id);
        setIsSessionFetching(false);
        localStorage.setItem('sessionId', response.data.id);
        localStorage.setItem('sessionOpened', JSON.stringify(response.data));
      }
    } catch {
      setSessionData({});
      setIsSessionFetching(false);
      localStorage.removeItem('sessionOpened');
    }
  }, []);

  const fetchEndSession = useCallback(async () => {
    try {
      setIsSessionFetching(true);
      const response = await SessionService.putRequest({
        id: sessionId,
        isEndSession: true
      });
      if (!response.message) {
        setSessionId(null);
        setIsSessionFetching(false);
        setSessionData({});
        localStorage.removeItem('sessionId');
        localStorage.removeItem('sessionData');
        localStorage.removeItem('sessionOpened');
        window.location.reload();
      }
    } catch {
      setSessionData({});
      setIsSessionFetching(false);
      localStorage.removeItem('sessionId');
      localStorage.removeItem('sessionData');
      localStorage.removeItem('sessionOpened');
    }
  }, [sessionId]);

  const fetchSellBuyOperation = useCallback(async (data) => {
    try {
      setIsFetchingSell(true);
      const response = await OperationsService.postRequest(data);
      if (!response.message) {
        setIsFetchingSell(false);
      }
    } catch {
      setIsFetchingSell(false);
    }
  }, []);

  const contextData = {
    sessionData,
    isFetchingSell,
    fetchEndSession,
    cashierCurrency,
    isSessionFetching,
    fetchStartSession,
    fetchCashierCurrency,
    fetchSellBuyOperation,
    cashierCurrencyFetching
  };

  if (children instanceof Function) {
    return children(contextData);
  }

  return (
    <CashierContext.Provider value={contextData}>
      {children}
    </CashierContext.Provider>
  );
};

export default CashierProvider;
