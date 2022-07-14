import React, { useContext } from 'react';
import Styles from './submit-button-styles.scss';
import ContextForm from '@/presentation/contexts/form/form-context';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
}

export const SubmitButton: React.FC<Props> = (props: Props) => {
  const { state } = useContext(ContextForm);

  return (
    <button
      {...props}
      data-testid="submit"
      disabled={state.isFormInvalid}
      className={Styles.submit}
      type="submit"
    >
      {props.text}
    </button>
  );
};
