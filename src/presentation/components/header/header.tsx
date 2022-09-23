import React, { memo } from 'react';
import { Logo } from '@/presentation/components';

import Styles from './header-styles.scss';

const HeaderComponent: React.FC = () => {
  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span>Fernando</span>
          <a href="#">Sair</a>
        </div>
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);
