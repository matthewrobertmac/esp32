import React from 'react';

const EspCameraFeed = () => {
    return (
        <div>
            <h1>ESP32 Camera Feed</h1>
            <video width="720" height="540" autoPlay>
                <source src="http://localhost:3001/stream" type="video/mjpeg" />
                Video stream not available
            </video>
        </div>
    );
}

export default EspCameraFeed;
