import React from 'react';
import s from './Header.module.scss';
import Search from '../Search/Search';

interface HeaderProps {
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className={s.header}>
      <h1 className={s.title}>Discover Your Perfect Breed</h1>
      <p className={s.subtitle}>
        Use the field below to find the cat breed you are interested in.
      </p>
      <p className={s.subtitle}>
        For example: Maine, Bengal, Sphynx, Norwegian, Persian, Ocicat, etc.
      </p>
      <Search onSearch={onSearch} />
    </header>
  );
};

export default Header;
