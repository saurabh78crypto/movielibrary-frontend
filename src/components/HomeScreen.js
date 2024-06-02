import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import MovieSlider from './MovieSlider';


const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [playlists, setPlaylists] = useState([]);
  
  
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://movielibrary-backend-jw44.onrender.com/api/auth/fetchplaylists', {
          headers:{
            Authorization: `Bearer ${token}`
          }
        }); 
        setPlaylists(response.data.playlists)
      } catch (error) {
        console.error('Failed to fetch playlists:', error);
      }
    };

    fetchPlaylist();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/fetchMovies?q=${encodeURIComponent(searchQuery)}`);
      setMovies(response.data.Search);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to search movie. Please try again later.');
    }
  };

  const updatePlaylists = (newPlaylist) => {
    setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
  };


  return (
    <div className='home-screen'>
      <MovieSlider playlists={playlists} />

      <div className='search-container-header'>
        <h2>Search Movies</h2>
      </div>
      <div className='search-container'>
        <input type="text" 
        placeholder="Search Movies" 
        value={searchQuery} 
        onChange={handleSearchChange} 
        className='search-input' />

        <button type='submit' onClick={handleSearchSubmit} className='search-button'>Search</button>
      </div>
      

      {movies && movies.length > 0 && (
        <div className='movie-grid'>
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} movies={movies} playlists={playlists} updatePlaylists={updatePlaylists} />
          ))}
        </div>
      )}
      {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
    </div>
  );
};

export default HomeScreen;