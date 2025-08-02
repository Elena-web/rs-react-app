import { NavLink } from 'react-router-dom';
import pawIcon from '../../assets/icon-paw.png';
import { useTheme } from '../../context/ThemeContext';
import s from './Navigation.module.scss';

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={s.nav}>
      <NavLink to="/" className={s.logo}>
        <img src={pawIcon} className={s.image} alt="Cats" />
        <p>Cats</p>
      </NavLink>
      <div className={s.container}>
        <NavLink to="/" className={s.link}>
          Home
        </NavLink>
        <NavLink to="/about" className={s.link}>
          About
        </NavLink>
        <button onClick={toggleTheme} className={s.button}>
          Switch to {theme === 'light' ? 'dark' : 'light'} theme
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
