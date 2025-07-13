import React from 'react';
import s from './Header.module.scss';

interface HeaderProps {
  onSearch: (term: string) => void;
}

class Header extends React.Component<HeaderProps> {
  render() {
    return (
      <header className={s.header}>
        <h1 className={s.title}>Discover Your Purrfect Breed</h1>
        <p className={s.subtitle}>
          Use the field below to find the cat breed you are interested in.
        </p>
        <p className={s.subtitle}>
          For example: Main Coon, Bengal, Sphynx, Norwegian, Persian,Ocicat,etc.
        </p>
      </header>
    );
  }
}

export default Header;
