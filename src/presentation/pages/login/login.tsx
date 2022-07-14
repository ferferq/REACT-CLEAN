import React, { useEffect, useState } from 'react';

import {
  LoginHeader,
  Footer,
  Input,
  FormStatus,
} from '@/presentation/components';
import ContextForm from '@/presentation/contexts/form/form-context';

import Styles from './login-styles.scss';
import { Validation } from '@/presentation/protocols/validation';
import { Authentication, SaveAccessToken } from '@/domain/usecases';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitButton } from '@/presentation/components/submit-button/submit-button';

type Props = {
  validation: Validation;
  authentication: Authentication;
  saveAccessToken: SaveAccessToken;
};

const Login: React.FC<Props> = ({
  validation,
  authentication,
  saveAccessToken,
}: Props) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: '',
  });

  useEffect(() => {
    const { email, password } = state;
    const formData = { email, password };
    const emailError = validation.validate('email', formData);
    const passwordError = validation.validate('password', formData);
    const isFormInvalid = [!!emailError, !!passwordError].includes(true);
    setState({
      ...state,
      emailError,
      passwordError,
      isFormInvalid,
    });
  }, [state.email, state.password]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    try {
      const inputErrors = [!!state.emailError, !!state.passwordError].includes(
        true,
      );

      if (state.isLoading || inputErrors) {
        return;
      }
      setState({ ...state, isLoading: true });
      const account = await authentication.auth({
        email: state.email,
        password: state.password,
      });
      await saveAccessToken.save(account.accessToken);
      navigate('/', {
        replace: true,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        mainError: error.message,
      });
    }
  };

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <ContextForm.Provider value={{ state, setState }}>
        <form
          data-testid="form"
          className={Styles.form}
          onSubmit={handleSubmit}
        >
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite seu e-mail"
          />
          <SubmitButton
            data-testid="submit"
            disabled={state.isFormInvalid}
            className={Styles.submit}
            type="submit"
            text="Entrar"
          />
          <Link
            data-testid="signup"
            replace
            to="/signup"
            className={Styles.link}
          >
            Criar conta
          </Link>
          <FormStatus />
        </form>
      </ContextForm.Provider>
      <Footer />
    </div>
  );
};

export { Login };
