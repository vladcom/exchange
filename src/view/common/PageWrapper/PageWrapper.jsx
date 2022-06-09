import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const PageWrapper = ({ children }) => (
  <div className="pageWrapper">
    {children}
  </div>
);

PageWrapper.propTypes = {
  children: PropTypes.array
};

export default PageWrapper;
