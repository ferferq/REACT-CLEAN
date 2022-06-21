import React from 'react';
import { Router } from '@/infra/router';
import '@/presentation/styles/global.scss';
import { makeLogin } from '@/main/factories/pages/login/login-factory';

export const App: React.FC = () => {
  return <Router MakeLogin={makeLogin} />;
};
