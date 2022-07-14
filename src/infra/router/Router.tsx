import { Signup } from '@/presentation/pages/signup';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

type Props = {
  MakeLogin: React.FC;
  MakeSignup: React.FC;
};

export const Router: React.FC<Props> = ({ MakeLogin, MakeSignup }: Props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<MakeLogin />} />
        <Route path="/signup" element={<MakeSignup />} />
      </Routes>
    </BrowserRouter>
  );
};
