import React from 'react';
import { toggleTheme } from '../../features/themeSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import s from './ThemeToggle.module.scss';

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  return (
    <button className={s.button} onClick={() => dispatch(toggleTheme())}>
      Switch to {theme === 'light' ? 'dark' : 'light'} theme
    </button>
  );
};

export default ThemeToggle;
