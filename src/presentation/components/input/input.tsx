import React, { useContext } from 'react';
import Styles from './input-styles.scss';
import ContextForm from '@/presentation/contexts/form/form-context';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(ContextForm);
  const error = state[`${props.name}Error`];

  const enableInput = (
    event: React.FocusEvent<HTMLInputElement, Element>,
  ): void => {
    event.target.readOnly = false;
  };

  const handleChange = (
    event: React.FocusEvent<HTMLInputElement, Element>,
  ): void => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const getStatus = (): string => {
    return error ? '🔴' : '🟢';
  };
  const getTitle = (): string => {
    return error || 'Tudo certo!';
  };
  return (
    <div className={Styles.inputWrap}>
      <input
        {...props}
        data-testid={props.name}
        readOnly
        onFocus={enableInput}
        onChange={handleChange}
      />
      <span
        data-testid={`${props.name}-status`}
        title={getTitle()}
        className={Styles.status}
      >
        {getStatus()}
      </span>
    </div>
  );
};

export { Input };
