import React from 'react';
import { Box, Paper, Typography, Tooltip, IconButton } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const VideoPlayerView = ({ videoType, currentVideoUrl, currentTitle, videoMetadata, truncateUrl }) => {
 const renderVideo = () => {
  if (videoType === 'youtube') {
   return (
    <iframe
     title={currentTitle || ""}
     src={currentVideoUrl}
     style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 'none'
     }}
     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
     allowFullScreen
    />
   );
  } else {
   return (
    <video
     key={currentVideoUrl}
     controls
     style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
     }}
    >
     <source src={currentVideoUrl} type="video/mp4" />
     Your browser does not support the video tag.
    </video>
   );
  }
 };

 const renderMetadataTooltip = () => (
  <Box sx={{ p: 1 }}>
   <Typography variant="body2">Duration: {videoMetadata?.duration}</Typography>
   <Typography variant="body2">Format: {videoMetadata?.format}</Typography>
   <Typography variant="body2">Resolution: {videoMetadata?.resolution}</Typography>
   <Typography variant="body2">File Size: {videoMetadata?.size}</Typography>
  </Box>
 );

 return (
  <Box sx={{ width: '55%', minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
   <Paper elevation={3} sx={{ p: 2, flexGrow: 1 }}>
    {/* Title Bar */}
    <Box
     sx={{
      bgcolor: '#f5f5f5',
      p: 1,
      mb: 2,
      borderRadius: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
     }}
    >
     <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
       Video Playback: {currentTitle}
      </Typography>
      <Typography variant="caption" color="textSecondary" style={{ color: '#1565C0', cursor: 'pointer' }}>
       {truncateUrl(currentVideoUrl)}
      </Typography>
     </Box>
     <Tooltip title={renderMetadataTooltip()} arrow>
      <IconButton
       size="small"
       sx={{
        bgcolor: '#1978CD',
        color: 'white',
        '&:hover': { bgcolor: '#1565C0' },
        borderRadius: '2px'
       }}
      >
       <InfoIcon />
      </IconButton>
     </Tooltip>
    </Box>

    {/* Video Player */}
    <Box
     sx={{
      width: '100%',
      position: 'relative',
      paddingTop: '56.25%',
      bgcolor: '#000'
     }}
    >
     {renderVideo()}
    </Box>
   </Paper>
  </Box>
 );
};

export default VideoPlayerView;
