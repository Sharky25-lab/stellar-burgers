import { FC } from 'react';
import clsx from 'clsx';

import { IngredientDetails } from '@components';
import appStyles from '../../components/app/app.module.css';

export const IngredientPage: FC = () => (
  <div className={appStyles.detailPageWrap}>
    <h1
      className={clsx(appStyles.detailHeader, 'text text_type_main-large pb-6')}
    >
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </div>
);
