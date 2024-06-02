import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const PlaylistItem = ({ playlist }) => {

    return (
      <div className='playlist-item'>
        <div className='playlist-item-header'>
          <FontAwesomeIcon icon={faPlay} className='play-icon' />
          <h3>{playlist.playlistName}</h3>
        </div>
        <div className='playlist-item-body'>
          {playlist.movies.map((movie, index) => (
            <div key={index} className="playlist-item-movie">
                <img src={movie.Poster} alt={movie.Title || movie.name} className="poster" />
                <span className="movie-name">{movie.Title || movie.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };



  export default PlaylistItem;