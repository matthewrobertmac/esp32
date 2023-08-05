import React, { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, Button, Modal } from '@mui/material';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('http://localhost:3001/photos');
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          return;
        }

        const data = await response.json();
        setPhotos(data.reverse()); // Reverse the photos array
      } catch (e) {
        console.error(e);
      }
    };
    fetchPhotos();
  }, []);

  const handleOpen = (index) => {
    setSelectedImageIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (!open) return;
      if (event.key === 'ArrowRight') {
        setSelectedImageIndex((selectedImageIndex + 1) % photos.length);
      } else if (event.key === 'ArrowLeft') {
        setSelectedImageIndex((selectedImageIndex - 1 + photos.length) % photos.length);
      }
    },
    [open, selectedImageIndex, photos.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div>
      <h1>Photo Gallery</h1>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 345,
          },
        }}
      >
        {photos.map((photoUrl, index) => (
          <Card sx={{ maxWidth: 345 }} key={index}>
            <CardActionArea onClick={() => handleOpen(index)}>
              <CardMedia
                component="img"
                height="140"
                image={photoUrl}
                alt={`Photo ${index}`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Photo {photos.length - index} // Change the index
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click to view full size
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                <a href={photoUrl} download={`photo-${photos.length - index}.jpg`}>
                  Download
                </a>
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '80%', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4 
        }}>
          <img src={photos[selectedImageIndex]} alt="Full size" style={{ width: "100%", height: "auto" }} />
        </Box>
      </Modal>
    </div>
  );
};

export default PhotoGallery;
