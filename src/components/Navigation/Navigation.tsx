import { NavLink } from 'react-router-dom';
import pawIcon from '../../assets/icon-paw.png';
import s from './Navigation.module.scss';

function Navigation() {
  return (
    <nav className={s.nav}>
      <NavLink to="/" className={s.logo}>
        <img src={pawIcon} className={s.image} alt="Cats" />
        <p>Cats</p>
      </NavLink>
      <div className={s.container}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${s.link} ${s.active}` : s.link
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? `${s.link} ${s.active}` : s.link
          }
        >
          About
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation;
