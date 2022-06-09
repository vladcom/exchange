import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { isUndefined } from '../../utils/isUndefined';

const RedirectRoute = () => {
  const history = useHistory();
  const { token } = useParams();

  useEffect(() => {
    if (!isUndefined(token)) {
      history.push({
        pathname: '/auth',
        state: {
          token
        }
      });
    }
  }, [history, token]);
  return <CircularProgress />;
};

export default RedirectRoute;
