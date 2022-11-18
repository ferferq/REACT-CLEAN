import React, { useContext, useEffect, useState } from 'react';

import {
  LoginHeader,
  Footer,
  Input,
  FormStatus,
} from '@/presentation/components';
import ContextForm from '@/presentation/contexts/form/form-context';

import Styles from './signup-styles.scss';
import { Validation } from '@/presentation/protocols/validation';
import { AddAccount } from '@/domain/usecases';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitButton } from '@/presentation/components/submit-button/submit-button';
import apiContext from '@/presentation/contexts/api/api-context';

type Props = {
  validation: Validation;
  addAccount: AddAccount;
};

const Signup: React.FC<Props> = ({ validation, addAccount }: Props) => {
  const { setCurrentAccount } = useContext(apiContext);
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
    const { name } = state;
    const formData = { name };
    const nameError = validation.validate('name', formData);
    const isFormInvalid = !!nameError;

    setState((old) => ({
      ...old,
      nameError,
      isFormInvalid:
        isFormInvalid ||
        !!old.emailError ||
        !!old.passwordError ||
        !!old.passwordConfirmationError,
    }));
  }, [state.name]);

  useEffect(() => {
    const { email } = state;
    const formData = { email };
    const emailError = validation.validate('email', formData);
    const isFormInvalid = !!emailError;

    setState((old) => ({
      ...old,
      emailError,
      isFormInvalid:
        isFormInvalid ||
        !!old.nameError ||
        !!old.passwordError ||
        !!old.passwordConfirmationError,
    }));
  }, [state.email]);

  useEffect(() => {
    const { password } = state;
    const formData = { password };
    const passwordError = validation.validate('password', formData);
    const isFormInvalid = !!passwordError;

    setState((old) => ({
      ...old,
      passwordError,
      isFormInvalid:
        isFormInvalid ||
        !!old.nameError ||
        !!old.emailError ||
        !!old.passwordConfirmationError,
    }));
  }, [state.password]);

  useEffect(() => {
    const { password, passwordConfirmation } = state;
    const formData = { password, passwordConfirmation };
    const passwordConfirmationError = validation.validate(
      'passwordConfirmation',
      formData,
    );
    const isFormInvalid = !!passwordConfirmationError;

    setState((old) => ({
      ...old,
      passwordConfirmationError,
      isFormInvalid:
        isFormInvalid ||
        !!old.nameError ||
        !!old.emailError ||
        !!old.passwordError,
    }));
  }, [state.passwordConfirmation]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    try {
      if (state.isLoading || state.isFormInvalid) {
        return;
      }

      setState((old) => ({ ...old, isLoading: true }));
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
      });
      setCurrentAccount(account);
      navigate('/', {
        replace: true,
      });
    } catch (error) {
      setState((old) => ({
        ...old,
        isLoading: false,
        mainError: error.message,
      }));
    }
  };

  return (
    <div className={Styles.signupWrap}>
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
