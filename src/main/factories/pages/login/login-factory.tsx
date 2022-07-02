import React from 'react';
import { Login } from '@/presentation/pages/login';
import { makeRemoteAuthentication } from '@/main/factories/useCases/authentication/remote-authentication-factory';
import { makeLoginValidation } from './login-validation-factory';
import { makeSaveAccessToken } from '@/main/factories/useCases/save-access-token/local-save-access-token-factory';

export const makeLogin: React.FC = () => {
  return (
    <Login
      validation={makeLoginValidation()}
      authentication={makeRemoteAuthentication()}
      saveAccessToken={makeSaveAccessToken()}
    />
  );
};
