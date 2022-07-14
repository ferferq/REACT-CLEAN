import React from 'react';
import { Router } from '@/infra/router';
import '@/presentation/styles/global.scss';
import { makeLogin } from '@/main/factories/pages/login/login-factory';
import { makeSignup } from '@/main/factories/pages/signup/signup-factory';

export const App: React.FC = () => {
  return <Router MakeLogin={makeLogin} MakeSignup={makeSignup} />;
};
