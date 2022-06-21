import React from 'react';
import { Login } from '@/presentation/pages';
import { makeRemoteAuthentication } from '@/main/factories/useCases/authentication/remote-authentication-factory';
import { makeLoginValidation } from './login-validation-factory';

export const makeLogin: React.FC = () => {
  return (
    <Login
      validation={makeLoginValidation()}
      authentication={makeRemoteAuthentication()}
    />
  );
};
