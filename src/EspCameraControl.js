import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const EspCameraControl = () => {
  const [frameSize, setFrameSize] = useState(7);
  const [stillImage, setStillImage] = useState('');
  const [captureBurst, setCaptureBurst] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isCloudMode, setIsCloudMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:3001/control?var=framesize&val=${frameSize}`);
    if (!response.ok) {
      alert('Failed to update camera setting');
    }
  };

  const handleCapture = async () => {
    const timestamp = new Date().getTime();
    const response = await fetch(`http://localhost:3001/capture?_cb=${timestamp}`);

    if (!response.ok) {
      alert('Failed to capture image');
      return;
    }

    const blob = await response.blob();

    let formData = new FormData();
    formData.append('image', blob);

    let uploadUrl = isCloudMode ? 'http://localhost:3001/upload_image' : 'http://localhost:3001/upload_image_local';

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      alert('Failed to upload image');
      return;
    }

    const imageUrl = await uploadResponse.text();
    setStillImage(imageUrl);
  };

  const handleBurstCapture = () => {
    setCaptureBurst(true);
  };

  const captureBurstImages = async () => {
    for (let i = 0; i < 120; i++) {
      await handleCapture();
      setProgress((i + 1) * (100 / 120));
    }
    setCaptureBurst(false);
  };

  const handleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      const stopResponse = await fetch(`http://localhost:3001/stop_recording`);
      if (!stopResponse.ok) {
        alert('Failed to stop recording');
        return;
      }

      const videoBlob = await stopResponse.blob();
      let formData = new FormData();
      formData.append('video', videoBlob);

      let uploadUrl = isCloudMode ? 'http://localhost:3001/upload_video_cloud' : 'http://localhost:3001/upload_video_local';

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        alert('Failed to upload video');
        return;
      }

      const videoUrl = await uploadResponse.text();
      setRecordedVideo(videoUrl);
    } else {
      setIsRecording(true);
      const recordResponse = await fetch(`http://localhost:3001/start_recording`);
      if (!recordResponse.ok) {
        alert('Failed to start recording');
        return;
      }

      setTimeout(() => {
        handleRecording();
      }, 600000); // 10 minutes in milliseconds
    }
  };

  useEffect(() => {
    if (captureBurst) {
      captureBurstImages();
    }
  }, [captureBurst]);

  useEffect(() => {
    const overallTimer = setInterval(() => {
      setOverallProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
    }, 3000);
    return () => {
      clearInterval(overallTimer);
    };
  }, []);

  return (
    <div>
      <h1>ESP32 Camera Control</h1>
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Frame Size"
          type="number"
          value={frameSize}
          onChange={(e) => setFrameSize(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
      </form>
      <FormControlLabel
        control={<Switch checked={isCloudMode} onChange={() => setIsCloudMode(!isCloudMode)} />}
        label={isCloudMode ? "Cloud Mode" : "Local Mode"}
      />
      <Stack spacing={2} direction="row">
        <Button variant="contained" color="primary" onClick={handleCapture}>Capture Image</Button>
        <Button variant="contained" color="secondary" onClick={handleBurstCapture}>Capture Burst</Button>
        <Button variant="contained" color={isRecording ? "secondary" : "primary"} onClick={handleRecording}>
          {isRecording ? "Stop Recording" : "Record 10 min Video"}
        </Button>
        {captureBurst && 
          <Box>
            <Typography>Capturing Burst:</Typography>
            <CircularProgress variant="determinate" value={progress} />
          </Box>
        }
        <Box>
          <Typography>Overall Progress:</Typography>
          <CircularProgress variant="determinate" value={overallProgress} />
        </Box>
      </Stack>
      {stillImage && <img src={stillImage} alt="Still capture" />}
      {recordedVideo && <video src={recordedVideo} controls />}
    </div>
  );
};

export default EspCameraControl;



// import React, { useState, useEffect } from 'react';
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
// import CircularProgress from '@mui/material/CircularProgress';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';

// const EspCameraControl = () => {
//   const [frameSize, setFrameSize] = useState(7);
//   const [stillImage, setStillImage] = useState('');
//   const [captureBurst, setCaptureBurst] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [overallProgress, setOverallProgress] = useState(0);
//   const [isCloudMode, setIsCloudMode] = useState(true); // New state for saving mode

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Send a request to the camera to update the frame size
//     const response = await fetch(`http://localhost:3001/control?var=framesize&val=${frameSize}`);
//     if (!response.ok) {
//       alert('Failed to update camera setting');
//     }
//   };

//   const handleCapture = async () => {
//     const timestamp = new Date().getTime();
//     const response = await fetch(`http://localhost:3001/capture?_cb=${timestamp}`);
  
//     if (!response.ok) {
//       alert('Failed to capture image');
//       return;
//     }
  
//     const blob = await response.blob();

//     let formData = new FormData();
//     formData.append('image', blob);

//     let uploadUrl = isCloudMode ? 'http://localhost:3001/upload_image' : 'http://localhost:3001/upload_image_local';

//     const uploadResponse = await fetch(uploadUrl, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!uploadResponse.ok) {
//       alert('Failed to upload image');
//       return;
//     }

//     const imageUrl = await uploadResponse.text();
//     setStillImage(imageUrl);
//   };

//   const handleBurstCapture = () => {
//     setCaptureBurst(true);
//   };

//   const captureBurstImages = async () => {
//     for (let i = 0; i < 120; i++) {
//       await handleCapture();
//       setProgress((i + 1) * (100 / 120));
//     }
//     setCaptureBurst(false);
//   };

//   useEffect(() => {
//     if (captureBurst) {
//       captureBurstImages();
//     }
//   }, [captureBurst]);

//   useEffect(() => {
//     const overallTimer = setInterval(() => {
//       setOverallProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
//     }, 3000);
//     return () => {
//       clearInterval(overallTimer);
//     };
//   }, []);

//   return (
//     <div>
//       <h1>ESP32 Camera Control</h1>
//       <form onSubmit={handleSubmit}>
//         <TextField 
//           label="Frame Size"
//           type="number"
//           value={frameSize}
//           onChange={(e) => setFrameSize(e.target.value)}
//         />
//         <Button type="submit" variant="contained" color="primary">
//           Update
//         </Button>
//       </form>
//       <FormControlLabel
//         control={<Switch checked={isCloudMode} onChange={() => setIsCloudMode(!isCloudMode)} />}
//         label={isCloudMode ? "Cloud Mode" : "Local Mode"}
//       />
//       <Stack spacing={2} direction="row">
//         <Button variant="contained" color="primary" onClick={handleCapture}>Capture Image</Button>
//         <Button variant="contained" color="secondary" onClick={handleBurstCapture}>Capture Burst</Button>
//         {captureBurst && 
//           <Box>
//             <Typography>Capturing Burst:</Typography>
//             <CircularProgress variant="determinate" value={progress} />
//           </Box>
//         }
//         <Box>
//           <Typography>Overall Progress:</Typography>
//           <CircularProgress variant="determinate" value={overallProgress} />
//         </Box>
//       </Stack>
//       {stillImage && <img src={stillImage} alt="Still capture" />}
//     </div>
//   );
// };

// export default EspCameraControl;
