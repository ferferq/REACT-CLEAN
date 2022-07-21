import React, { useContext, useRef } from 'react';
import Styles from './input-styles.scss';
import ContextForm from '@/presentation/contexts/form/form-context';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: React.FC<Props> = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>();
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

  return (
    <div
      data-testid={`${props.name}-wrap`}
      className={Styles.inputWrap}
      data-status={error ? 'invalid' : 'valid'}
    >
      <input
        {...props}
        ref={inputRef}
        title={error}
        data-testid={props.name}
        readOnly
        onFocus={enableInput}
        onChange={handleChange}
        placeholder=" "
      />
      <label
        data-testid={`${props.name}-label`}
        title={error}
        onClick={() => {
          inputRef.current.focus();
        }}
      >
        {props.placeholder}
      </label>
    </div>
  );
};

export { Input };
