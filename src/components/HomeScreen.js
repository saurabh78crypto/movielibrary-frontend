import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import MovieSlider from './MovieSlider';
import Spinner from './Spinner';


const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  
  useEffect(() => {
    const fetchPlaylist = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://movielibrary-backend-jw44.onrender.com/api/auth/searchmovie?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMovies(response.data.data.Search);
      setErrorMessage('');
    } catch (error) {
      if(error.response && error.response.status === 500){
        setErrorMessage('Failed to search movie. Please try again later.');
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlaylists = (newPlaylist) => {
    setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
  };


  return (
    <div className='home-screen'>
      {isLoading? (
        <Spinner />
      ) : (

        <>
          <MovieSlider 
            playlists={playlists}
            isLoading={isLoading}
            updatePlaylists={updatePlaylists}
            setIsLoading={setIsLoading} 
          />

          <div className='search-container-header'>
            <h2>Search Movies</h2>
          </div>
          <div className='search-container'>
            <input type="text" 
              placeholder="Search Movies" 
              value={searchQuery} 
              onChange={handleSearchChange} 
              className='search-input' />

            <button type='submit' 
              onClick={handleSearchSubmit} 
              className='search-button'>
                Search
            </button>
          </div>


          {movies && movies.length > 0 && (
            <div className='movie-grid'>
              {movies.map((movie, index) => (
                <MovieCard key={index} 
                  movie={movie}
                  movies={movies} 
                  playlists={playlists} 
                  updatePlaylists={updatePlaylists}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading} 
                />
              ))}
            </div>
          )}
          {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
        </>
      )}
    </div>
  );
};

export default HomeScreen;