import React, { useEffect, useState } from 'react';

import {
  LoginHeader,
  Footer,
  Input,
  FormStatus,
} from '@/presentation/components';
import ContextForm from '@/presentation/contexts/form/form-context';

import Styles from './signup-styles.scss';
import { Validation } from '@/presentation/protocols/validation';
import { AddAccount, SaveAccessToken } from '@/domain/usecases';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitButton } from '@/presentation/components/submit-button/submit-button';

type Props = {
  validation: Validation;
  addAccount: AddAccount;
  saveAccessToken: SaveAccessToken;
};

const Signup: React.FC<Props> = ({
  validation,
  addAccount,
  saveAccessToken,
}: Props) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: 'Campo obrigatório',
    mainError: '',
  });

  useEffect(() => {
    const { name, email, password, passwordConfirmation } = state;
    const formData = { name, email, password, passwordConfirmation };
    const nameError = validation.validate('name', formData);
    const emailError = validation.validate('email', formData);
    const passwordError = validation.validate('password', formData);
    const passwordConfirmationError = validation.validate(
      'passwordConfirmation',
      formData,
    );
    const isFormInvalid = [
      !!nameError,
      !!emailError,
      !!passwordError,
      !!passwordConfirmationError,
    ].includes(true);

    setState({
      ...state,
      nameError,
      emailError,
      passwordError,
      passwordConfirmationError,
      isFormInvalid,
    });
  }, [state.name, state.email, state.password, state.passwordConfirmation]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    try {
      if (state.isLoading || state.isFormInvalid) {
        return;
      }

      setState({ ...state, isLoading: true });
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
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
    <div className={Styles.signup}>
      <LoginHeader />
      <ContextForm.Provider value={{ state, setState }}>
        <form
          data-testid="form"
          className={Styles.form}
          onSubmit={handleSubmit}
        >
          <h2>Criar conta</h2>
          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <Input
            type="password"
            name="passwordConfirmation"
            placeholder="Repita sua senha"
          />
          <SubmitButton
            data-testid="submit"
            disabled={state.isFormInvalid}
            className={Styles.submit}
            type="submit"
            text="Cadastrar"
          />
          <Link
            data-testid="login-link"
            replace
            to="/login"
            className={Styles.link}
          >
            Voltar para login
          </Link>
          <FormStatus />
        </form>
      </ContextForm.Provider>
      <Footer />
    </div>
  );
};

export { Signup };
