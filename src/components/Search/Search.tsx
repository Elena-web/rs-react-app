import React from 'react';
import useLocalStorage from '@hooks/useLocalStorage';
import s from './Search.module.scss';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>('searchTerm', '');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    setSearchTerm(trimmedTerm);
    onSearch(trimmedTerm);
  };

  return (
    <div className={s.search}>
      <input
        type="text"
        value={searchTerm}
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
