import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SurveyList } from './survey-list';
import { LoadSurveyList } from '@/domain/usecases/load-survey-list';
import { mockAccountModel, mockSurvetListModel } from '@/domain/test';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import ApiContext from '@/presentation/contexts/api/api-context';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { AccountModel } from '@/domain/models';

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0;
  surveys = mockSurvetListModel();
  async loadAll(): Promise<LoadSurveyList.Model[]> {
    this.callsCount++;
    return this.surveys;
  }
}

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy;
  history: MemoryHistory;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel(),
      }}
    >
      <Router location={history.location} navigator={history}>
        <SurveyList loadSurveyList={loadSurveyListSpy} />
      </Router>
    </ApiContext.Provider>,
  );

  return {
    loadSurveyListSpy,
    history,
    setCurrentAccountMock,
  };
};

describe('SurveyList page', () => {
  test('should present 4 empty items on start', async () => {
    makeSut();
    const surveyList = screen.getByTestId('survey-list');
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    await waitFor(() => surveyList);
  });

  test('should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut();
    expect(loadSurveyListSpy.callsCount).toBe(1);
    await waitFor(() => screen.getByRole('heading'));
  });

  test('should render SurveyItems on success', async () => {
    makeSut();
    const surveyList = screen.getByTestId('survey-list');
    await waitFor(() => {
      expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(3);
      expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    });
  });

  test('should render error on UnexpectedError', async () => {
    const error = new UnexpectedError();
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error);
    makeSut(loadSurveyListSpy);
    await waitFor(() => {
      screen.getByRole('heading');
      expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument();
      expect(screen.getByTestId('error')).toHaveTextContent(error.message);
    });
  });

  test('should logout on AccessDeniedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest
      .spyOn(loadSurveyListSpy, 'loadAll')
      .mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock, history } = makeSut(loadSurveyListSpy);
    await waitFor(() => {
      screen.getByRole('heading');
      expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
      expect(history.location.pathname).toBe('/login');
    });
  });

  test('should call LoadSurveyList on reload', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest
      .spyOn(loadSurveyListSpy, 'loadAll')
      .mockRejectedValueOnce(new UnexpectedError());
    makeSut(loadSurveyListSpy);
    await waitFor(() => {
      screen.getByRole('heading');
      expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('reload'));
    await waitFor(() => {
      const surveyList = screen.getByTestId('survey-list');
      expect(loadSurveyListSpy.callsCount).toBe(1);
      expect(surveyList).toBeInTheDocument();
    });
  });
});
