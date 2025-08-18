'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import pawIcon from '../../../assets/icon-paw.png';
import Image from 'next/image';
import { useTheme } from '../../../context/ThemeContext';
import s from './Navigation.module.scss';

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <nav className={s.nav}>
      <Link href="/" className={s.logo}>
        <div
          className={s.logoImageWrapper}
          style={{ position: 'relative', width: '32px', height: '32px' }}
        >
          <Image
            src={pawIcon}
            alt="Cats"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <p>Cats</p>
      </Link>
      <div className={s.container}>
        <Link
          href="/"
          className={`${s.link} ${pathname === '/' ? s.active : ''}`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`${s.link} ${pathname === '/about' ? s.active : ''}`}
        >
          About
        </Link>
        <button onClick={toggleTheme} className={s.button}>
          Switch to {theme === 'light' ? 'dark' : 'light'} theme
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
