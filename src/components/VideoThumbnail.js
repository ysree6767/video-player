import React from 'react';
import { Box, Paper, Grid, Card, CardMedia, Typography, Button, Tooltip, IconButton } from '@mui/material';
import { NavigateBefore, NavigateNext, Info as InfoIcon } from '@mui/icons-material';

const VideoThumbnail = ({ videos, currentVideoIndex, handlePrev, handleNext, handleThumbnailClick }) => {
 const renderMetadataTooltip = (metadata) => (
  <Box sx={{ p: 1 }}>
   <Typography variant="body2">Duration: {metadata?.duration}</Typography>
   <Typography variant="body2">Format: {metadata?.format}</Typography>
   <Typography variant="body2">Resolution: {metadata?.resolution}</Typography>
   <Typography variant="body2">File Size: {metadata?.size}</Typography>
  </Box>
 );

 return (
  <Box sx={{ width: '40%' }}>
   <Paper elevation={3} sx={{ p: 2 }}>
    {/* Navigation Buttons */}
    <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 1, mb: 2 }}>
     <Button
      onClick={handlePrev}
      variant="contained"
      startIcon={<NavigateBefore />}
      sx={{ bgcolor: '#1978CD' }}
     >
      Prev Video
     </Button>
     <Button
      onClick={handleNext}
      variant="contained"
      endIcon={<NavigateNext />}
      sx={{ bgcolor: '#1978CD' }}
     >
      Next Video
     </Button>
    </Box>

    {/* Video Grid */}
    <Box sx={{ height: '450px', padding: '5px', overflowY: 'auto' }}>
     <Grid container spacing={2}>
      {videos.map((video, index) => (
       <Grid item xs={6} key={video.id}>
        <Card
         onClick={() => handleThumbnailClick(index)}
         sx={{
          position: 'relative',
          cursor: 'pointer',
          border: index === currentVideoIndex ? '2px solid #1978CD' : 'none'
         }}
        >
         <CardMedia
          component="img"
          image={video.thumbnail}
          alt={video.title}
          sx={{ height: 120, width: '100%', objectFit: 'cover' }}
         />
         <Box
          sx={{
           position: 'absolute',
           bottom: 0,
           left: 0,
           right: 0,
           bgcolor: 'rgba(0, 0, 0, 0.5)',
           p: 1,
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'space-between',
           color: '#CECECE'
          }}
         >
          <Typography variant="body2">{video.title}</Typography>
          <Tooltip title={renderMetadataTooltip(video.metadata)} arrow>
           <IconButton size="small">
            <InfoIcon style={{ color: '#CECECE' }} />
           </IconButton>
          </Tooltip>
         </Box>
        </Card>
       </Grid>
      ))}
     </Grid>
    </Box>
   </Paper>
  </Box>
 );
};

export default VideoThumbnail;
