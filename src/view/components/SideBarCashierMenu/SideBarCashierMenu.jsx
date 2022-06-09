import React, { useContext } from 'react';
import './style.scss';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import ArrowCircleDownRoundedIcon from '@mui/icons-material/ArrowCircleDownRounded';
import isEmpty from 'lodash.isempty';
import { CashierContext } from '../CashierContext';

const SideBarCashierMenu = () => {
  const { sessionData } = useContext(CashierContext);
  const isDisabled = isEmpty(sessionData);

  return (
    <div className="cashier-menu">
      <Link
        to="/cashier-buy"
        className={cx('cashier-menu-item', {
          disabledMenu: isDisabled
        })}
      >
        <ArrowCircleDownRoundedIcon />
        <span>Покупка</span>
      </Link>
      <Link
        to="/cashier-sell"
        className={cx('cashier-menu-item', {
          disabledMenu: isDisabled
        })}
      >
        <ArrowCircleUpRoundedIcon />
        <span>Продажа</span>
      </Link>
      <Link
        to="/cashier-cross-course"
        className={cx('cashier-menu-item', {
          disabledMenu: isDisabled
        })}
      >
        <CompareArrowsRoundedIcon />
        <span>Кросс-курс</span>
      </Link>
    </div>
  );
};

export default SideBarCashierMenu;
