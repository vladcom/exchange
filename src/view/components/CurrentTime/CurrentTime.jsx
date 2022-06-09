import React, { useEffect, useState } from 'react';
import moment from 'moment';

const CurrentTime = () => {
  const [time, setCurrentTime] = useState(moment());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <p className="current-time">
      {moment(time).format('D.MM.YYYY HH:mm')}
    </p>
  );
};

export default CurrentTime;
