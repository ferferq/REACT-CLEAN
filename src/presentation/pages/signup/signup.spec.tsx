import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { Signup } from './signup';
import { Helper } from '@/presentation/test';

const makeSut = (): RenderResult => {
  return render(<Signup />);
};

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = 'Campo obrigatório';
    const sut = makeSut();
    Helper.testChildCount(sut, 'error-wrap', 0);
    Helper.testButtonIsDisabled(sut, 'submit', true);
    Helper.testStatusForField(sut, 'name', validationError);
    Helper.testStatusForField(sut, 'email', validationError);
    Helper.testStatusForField(sut, 'password', validationError);
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
  });
});
