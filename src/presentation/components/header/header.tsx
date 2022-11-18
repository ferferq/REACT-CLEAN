import React, { memo, useContext } from 'react';
import { Logo } from '@/presentation/components';

import Styles from './header-styles.scss';
import apiContext from '@/presentation/contexts/api/api-context';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/presentation/hooks';

const HeaderComponent: React.FC = () => {
  const { getCurrentAccount } = useContext(apiContext);
  const handleLogout = useLogout();

  const logout = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ): void => {
    event.preventDefault();
    handleLogout();
  };

  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span data-testid="username">{getCurrentAccount().name}</span>
          <a data-testid="logout" href="#" onClick={logout}>
            Sair
          </a>
        </div>
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);
