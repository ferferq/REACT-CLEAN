import { AccessDeniedError } from '@/domain/errors';
import { useLogout } from '@/presentation/hooks';

type CallBackType = (error: Error) => void;
type ResultType = (error: Error) => void;

export const useErrorHandler = (callback: CallBackType): ResultType => {
  const handleLogout = useLogout();

  return (error: Error): void => {
    if (error instanceof AccessDeniedError) {
      handleLogout();
    } else {
      callback(error);
    }
  };
};
