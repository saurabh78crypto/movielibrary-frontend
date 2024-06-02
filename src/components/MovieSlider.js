import React, { useRef, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import PlaylistItem from './PlaylistItem';


const MovieSlider = ({playlists}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const sliderRef = useRef(null);
  
  const sliderSettings = {
    dots: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: playlists.length > 1,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: true,
          dots: false
        }
      }
    ]
  };

  const showStaticCard = !playlists || playlists.length === 0;

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('https://movielibrary-backend-jw44.onrender.com/api/auth/newlibrary', {playlistName}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Response: ', response);
      setPopupMessage(`Playlist "${playlistName}" created.`);
      setShowPopup(true);
      closeModal();

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
    }
  }; 

  const scrollSlider = (direction) => {
    let newIndex;
      if (direction === 'prev') {
        newIndex = sliderSettings.slidesToShow - 1;
      } else if (direction === 'next') {
        newIndex = 0;
      }
    
      if(sliderRef.current){
        sliderRef.current.slickGoTo(newIndex);
      }
  };

 
  return (
    <div className='slider-container'>
      <div className='slider-container-header'>
        <h2>My Playlists</h2>
      </div>
        {showStaticCard && (
          <div className='static-card' onClick={showModal}>
            <FontAwesomeIcon icon={faPlus} className='plus-icon' />
            <h3 className='text-1'>Create Your First</h3>
            <h3 className='text-2'>Playlist</h3>
          </div>
        )}
      <Slider ref={sliderRef} {...sliderSettings}>
        {!showStaticCard && playlists.map((playlist, index) => (
          playlist && playlist._id? (
            <div key={playlist._id} >
              <PlaylistItem  playlist={playlist}/>
            </div>
          ) : null
          ))}
      </Slider>
      <div className='slider-controls'>
        <button onClick={() => scrollSlider('prev')}>
          <FontAwesomeIcon icon={faChevronLeft}/>
        </button>
        <button onClick={() => scrollSlider('next')}>
          <FontAwesomeIcon icon={faChevronRight}/>
        </button>
      </div>
      
      <Modal show={isModalOpen} onHide={closeModal} className='modal-custom' backdropClassName='transparent-backdrop'>
        <Modal.Header closeButton className='modal-header-custom'>
          <Modal.Title className='modal-title-custom'>Create Your First Playlist</Modal.Title>
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
    </div>
  );
};

export default MovieSlider;
