import React from 'react';
import { Signup } from '@/presentation/pages/signup';
import { makeRemoteAddAccount } from '../../useCases/addAccount/remote-add-account-factory';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignup: React.FC = () => {
  return (
    <Signup
      validation={makeSignUpValidation()}
      addAccount={makeRemoteAddAccount()}
    />
  );
};
