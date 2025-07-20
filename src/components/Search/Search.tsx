import React, { Component } from 'react';
import s from './Search.module.scss';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
}

interface SearchState {
  searchTerm: string;
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem('searchTerm') || '',
    };
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleSearch = () => {
    const { searchTerm } = this.state;
    this.props.onSearch(searchTerm.trim());
    localStorage.setItem('searchTerm', searchTerm.trim());
  };

  render() {
    return (
      <div className={s.search}>
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
          className={s.input}
          placeholder="Siberian"
        />
        <button onClick={this.handleSearch} className={s.button}>
          Search
        </button>
      </div>
    );
  }
}

export default Search;
