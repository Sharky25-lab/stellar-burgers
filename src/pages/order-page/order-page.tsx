import { FC } from 'react';

import { OrderInfo } from '@components';
import appStyles from '../../components/app/app.module.css';

export const OrderPage: FC = () => (
  <div className={appStyles.detailPageWrap}>
    <OrderInfo />
  </div>
);
