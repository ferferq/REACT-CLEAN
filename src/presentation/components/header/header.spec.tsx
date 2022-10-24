import React from 'react';
import ApiContext from '@/presentation/contexts/api/api-context';
import { fireEvent, render, screen } from '@testing-library/react';
import { Header } from './header';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('Header Component', () => {
  test('Should call setCurrentAccount with null', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const setCurrentAccount = jest.fn();
    render(
      <ApiContext.Provider value={{ setCurrentAccount }}>
        <Router location={history.location} navigator={history}>
          <Header />
        </Router>
      </ApiContext.Provider>,
    );
    fireEvent.click(screen.getByTestId('logout'));
    expect(setCurrentAccount).toHaveBeenCalledWith(undefined);
    expect(history.location.pathname).toBe('/login');
  });
});
