'use client';

import React, { useState, useEffect } from 'react';
import s from './Search.module.scss';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  defaultValue?: string;
}

const Search: React.FC<SearchProps> = ({ onSearch, defaultValue = '' }) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    const trimmedValue = inputValue.trim();
    onSearch(trimmedValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchTerm', trimmedValue);
    }
  };

  return (
    <div className={s.search}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={s.input}
        placeholder="Siberian"
      />
      <button onClick={handleSearch} className={s.button}>
        Search
      </button>
    </div>
  );
};

export default Search;
