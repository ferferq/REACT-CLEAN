import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { makeLogin as MakeLogin } from '@/main/factories/pages/login/login-factory';
import { makeSignup as MakeSignup } from '@/main/factories/pages/signup/signup-factory';
import { makeSurveyList as MakeSurveyList } from '@/main/factories/pages/survey-list/survey-list-factory';
import ApiContext from '@/presentation/contexts/api/api-context';
import {
  setCurrentAccountAdapter,
  getCurrentAccountAdapter,
} from '@/main/adapters';
import PrivateRoute from '@/presentation/components/private-route/private-route';

export const Router: React.FC = () => {
  return (
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<MakeLogin />} />
          <Route path="/signup" element={<MakeSignup />} />
          <Route path="/" element={<PrivateRoute Element={MakeSurveyList} />} />
        </Routes>
      </BrowserRouter>
    </ApiContext.Provider>
  );
};
