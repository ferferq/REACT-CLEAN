import React, { memo, useContext } from 'react';
import { Logo } from '@/presentation/components';

import Styles from './header-styles.scss';
import apiContext from '@/presentation/contexts/api/api-context';
import { useNavigate } from 'react-router-dom';

const HeaderComponent: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentAccount } = useContext(apiContext);

  const logout = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ): void => {
    event.preventDefault();
    setCurrentAccount(undefined);
    navigate('/login', {
      replace: true,
    });
  };

  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span>Fernando</span>
          <a data-testid="logout" href="#" onClick={logout}>
            Sair
          </a>
        </div>
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);
