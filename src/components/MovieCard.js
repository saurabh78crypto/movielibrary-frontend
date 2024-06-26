import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Spinner } from 'react-bootstrap';

const MovieCard = ({ movie, playlists, updatePlaylists, isLoading, setIsLoading }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, setSelectedPlaylist] = useState('');
    const [playlistName, setPlaylistName] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    

    const addMovie = async (playlistId) => {
        try {
            setIsLoading(true);
            const data = {
                libraryId: playlistId,
                movie: movie
            }
            const response = await axios.post('https://movielibrary-backend-jw44.onrender.com/api/auth/addmovie',data);
            updatePlaylists(response.data.library);
            setPopupMessage(`The "${movie.Title}" added successfully.`)
            setShowPopup(true);
            
            setTimeout(() => {
                setShowPopup(false);
                setShowOptions(false);
            }, 1000);

        } catch (error) {
            if(error.response && error.response.status === 409){
                setPopupMessage(`The "${movie.Title}" already in the playlist`);
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                    setShowOptions(false);
                }, 2000)
            } else {
                console.error(error);    
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
          const token = localStorage.getItem('token');
          
          const response = await axios.post('https://movielibrary-backend-jw44.onrender.com/api/auth/newlibrary', {playlistName}, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const newPlaylist = response.data.library;
          setPopupMessage(`Playlist "${playlistName}" created.`);
          setShowPopup(true);
          closeModal();
          
          setSelectedPlaylist(newPlaylist._id);
          addMovie(newPlaylist._id);
          updatePlaylists(response.data.library);

          setTimeout(() => {
            setPlaylistName('');
            setShowPopup(false);
          }, 2000);
        } catch (error) {
          if(error.response && error.response.status === 409){
            setPopupMessage('Playlist Already Created.');
            setShowPopup(true);
    
            setTimeout(() => {
              setPlaylistName('');
              setShowPopup(false);
            }, 3000);
          } else {
            console.error(error);
          }  
        } finally {
            setIsLoading(false);
        }
      }; 
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showOptions &&!document.getElementById("option-menu").contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showOptions]);

    const toggleOptions = async () => {
        setShowOptions(!showOptions);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    
    return (
        <div className='movie-card'>
            {isLoading? (
                <Spinner />
            ) : (

                <>
                    <img src={movie.Poster} alt={`${movie.Title} Poster`} className="movie-poster" />
                    <div className="movie-card-desc">
                        <div className="movie-card-desc-title">
                            <h3>{movie.Title}</h3>
                        </div>
                        <div className="movie-card-desc-other">
                            <p>Type: {movie.Type}</p>
                            <p>Year: {movie.Year}</p>
                            <p>IMDB ID: {movie.imdbID}</p>
                        </div>
                    </div>
                    
                    <button className="add-to-library-btn" onClick={toggleOptions}>Add to Library</button>
                    {showOptions && (
                        <div id="option-menu" className="options-menu">
                            <ul> 
                                <li onClick={() => setIsModalOpen(true)}>Create New Playlist</li>
                                {playlists.map((playlist, index) => (
                                    <li key={index} value={playlist._id} onClick={() => addMovie(playlist._id)}>{playlist.playlistName}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Modal show={isModalOpen} onHide={closeModal} className='modal-custom' backdropClassName='transparent-backdrop'>
                        <Modal.Header closeButton className='modal-header-custom'>
                            <Modal.Title className='modal-title-custom'>Create New Playlist</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='modal-body-custom'>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="playlistName">Playlist Name:</label>
                                <input 
                                type="text" 
                                id='playlistName' 
                                name='playlistName' 
                                required 
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}/>
                                <button type='submit'>Create Playlist</button>
                            </form>
                        </Modal.Body>
                    </Modal>
                    <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
                    <Modal.Header>
                    </Modal.Header>
                      <Modal.Body>{popupMessage}</Modal.Body>
                    </Modal>
                </>
            )}
        </div> 
        
    );
};

export default MovieCard;
