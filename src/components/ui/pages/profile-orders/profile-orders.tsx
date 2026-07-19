import { FC } from 'react';

import styles from './profile-orders.module.css';

import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({
  orders,
  handleRefresh
}) => (
  <main className={`${styles.main}`}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <div className={`mt-10 ${styles.orders}`}>
      <div className={`${styles.titleBox} mb-5`}>
        <h1 className='text text_type_main-large'>История заказов</h1>
        <RefreshButton text='Обновить' onClick={handleRefresh} />
      </div>
      <OrdersList orders={orders} />
    </div>
  </main>
);
