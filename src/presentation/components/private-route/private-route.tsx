import apiContext from '@/presentation/contexts/api/api-context';
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  Element: React.FC;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  Element,
}: PrivateRouteProps) => {
  const { getCurrentAccount } = useContext(apiContext);

  const token = getCurrentAccount()?.accessToken;

  return token ? <Element /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
