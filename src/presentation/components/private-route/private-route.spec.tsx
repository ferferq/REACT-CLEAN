import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import PrivateRoute from './private-route';
import ApiContext from '@/presentation/contexts/api/api-context';
import { mockAccountModel } from '@/domain/test';

type SutTypes = {
  history: MemoryHistory;
};

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  render(
    <ApiContext.Provider
      value={{
        getCurrentAccount: () => account,
      }}
    >
      <Router location={history.location} navigator={history}>
        <PrivateRoute Element={() => <></>} />
      </Router>
    </ApiContext.Provider>,
  );

  return {
    history,
  };
};

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const { history } = makeSut(null);
    expect(history.location.pathname).toBe('/login');
  });

  test('Should render corrent component if token is not empty', () => {
    const { history } = makeSut();
    expect(history.location.pathname).toBe('/');
  });
});
