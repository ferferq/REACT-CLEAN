import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from './input';
import Context from '@/presentation/contexts/form/form-context';
import faker from 'faker';

const makeSut = (fieldName): void => {
  render(
    <Context.Provider value={{ state: {} }}>
      <Input name={fieldName} />
    </Context.Provider>,
  );
};

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    const fieldName = faker.database.column();
    makeSut(fieldName);
    const input = screen.getByTestId<HTMLInputElement>(fieldName);
    expect(input.readOnly).toBe(true);
  });

  test('Should remove readOnly on focus', () => {
    const fieldName = faker.database.column();
    makeSut(fieldName);
    const input = screen.getByTestId<HTMLInputElement>(fieldName);
    fireEvent.focus(input);
    expect(input.readOnly).toBe(false);
  });

  test('Should focus input on label click', () => {
    const fieldName = faker.database.column();
    makeSut(fieldName);
    const input = screen.getByTestId(fieldName);
    const label = screen.getByTestId(`${fieldName}-label`);
    fireEvent.click(label);
    expect(document.activeElement).toBe(input);
  });
});
