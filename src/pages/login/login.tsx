import { FC, SyntheticEvent, useState } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { selectLoginError } from '@selectors';
import { loginUser } from '../../services/slices/user-slice';

type TLocationState = {
  from?: Location;
};

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loginError = useSelector(selectLoginError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const { from } = (location.state as TLocationState) || {};
        navigate(from ?? '/', { replace: true });
      })
      .catch(() => {});
  };

  return (
    <LoginUI
      errorText={loginError ?? undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
