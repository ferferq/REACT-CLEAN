import React from 'react';
import { Signup } from '@/presentation/pages/signup';
import { makeSaveAccessToken } from '@/main/factories/useCases/save-access-token/local-save-access-token-factory';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeRemoteAddAccount } from '../../useCases/addAccount/remote-add-account-factory';

export const makeSignup: React.FC = () => {
  return (
    <Signup
      validation={makeSignUpValidation()}
      addAccount={makeRemoteAddAccount()}
      saveAccessToken={makeSaveAccessToken()}
    />
  );
};
