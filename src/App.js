import React, { useState } from 'react';
import { Box, Grid, Typography, Paper, Button, Card, CardMedia, Alert, CircularProgress, Tooltip, IconButton } from '@mui/material';
import { NavigateBefore, NavigateNext, Info as InfoIcon } from '@mui/icons-material';
import {videos} from './data/videoData.js'

const VideoPlayer = () => {

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [customUrl, setCustomUrl] = useState('');
  const [currentVideoUrl, setCurrentVideoUrl] = useState(videos[0].videoUrl);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoType, setVideoType] = useState('direct');
  const [videoMetadata, setVideoMetadata] = useState(videos[0].metadata);
  const [currentTitle, setCurrentTitle] = useState(videos[0].title);

  const truncateUrl = (url) => {
    return url.length > 50 ? url.substring(0, 47) + '...' : url;
  };

  const getYoutubeVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        if (url.includes('/shorts/')) {
          return url.split('/shorts/')[1].split('?')[0];
        }
        if (url.includes('watch?v=')) {
          return new URLSearchParams(urlObj.search).get('v');
        }
        if (urlObj.hostname === 'youtu.be') {
          return urlObj.pathname.slice(1);
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const isValidVideoUrl = (url) => {
    const youtubeId = getYoutubeVideoId(url);
    if (youtubeId) return true;
    try {
      new URL(url);
      return /\.(mp4|webm|ogg)$/i.test(url);
    } catch {
      return false;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePlayCustomUrl();
    }
  };

  const handlePrev = () => {
    setError('');
    setCurrentVideoIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? videos.length - 1 : prevIndex - 1;
      const video = videos[newIndex];
      setCurrentVideoUrl(video.type === 'youtube'
        ? `https://www.youtube.com/embed/${getYoutubeVideoId(video.videoUrl)}`
        : video.videoUrl
      );
      setVideoType(video.type);
      setVideoMetadata(video.metadata);
      setCurrentTitle(video.title);
      return newIndex;
    });
  };

  const handleNext = () => {
    setError('');
    setCurrentVideoIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % videos.length;
      const video = videos[newIndex];
      setCurrentVideoUrl(video.type === 'youtube'
        ? `https://www.youtube.com/embed/${getYoutubeVideoId(video.videoUrl)}`
        : video.videoUrl
      );
      setVideoType(video.type);
      setVideoMetadata(video.metadata);
      setCurrentTitle(video.title);
      return newIndex;
    });
  };

  const handleThumbnailClick = (index) => {
    const video = videos[index];
    setCurrentVideoIndex(index);
    setCurrentVideoUrl(video.type === 'youtube'
      ? `https://www.youtube.com/embed/${getYoutubeVideoId(video.videoUrl)}`
      : video.videoUrl
    );
    setVideoType(video.type);
    setVideoMetadata(video.metadata);
    setCurrentTitle(video.title);
    setError('');
  };

  const handlePlayCustomUrl = () => {
    if (!customUrl) {
      setError('Please enter a video URL');
      return;
    }

    if (!isValidVideoUrl(customUrl)) {
      setError('Please enter a valid video URL (YouTube URL or direct video file)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const youtubeId = getYoutubeVideoId(customUrl);
      if (youtubeId) {
        setVideoType('youtube');
        setCurrentVideoUrl(`https://www.youtube.com/embed/${youtubeId}`);
        setCurrentTitle('Custom Video');
        setVideoMetadata({
          duration: 'Unknown',
          format: 'YouTube',
          resolution: 'Unknown',
          size: 'Streaming'
        });
      } else {
        setVideoType('direct');
        setCurrentVideoUrl(customUrl);
        setCurrentTitle('Custom Video');
        setVideoMetadata({
          duration: 'Unknown',
          format: 'Unknown',
          resolution: 'Unknown',
          size: 'Unknown'
        });
      }
    } catch (err) {
      setError('Error processing video URL');
    } finally {
      setIsLoading(false);
    }
  };

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
    <Box sx={{ margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <Box sx={{
        bgcolor: '#FFAB41',
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 4,
        height: 60
      }}>
        <Typography sx={{ color: '#1978CD', fontSize: '20px' }}>
          Dori UX Interview: <Box component="span" sx={{ color: '#fff' }}>Sreenath</Box>
        </Typography>
        <Typography sx={{ color: '#1978CD', fontSize: '20px' }}>
          Today's Date: <Box component="span" sx={{ color: '#fff' }}>{new Date().toDateString()}</Box>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, p:2 }}>
        {/* Left Panel */}
        <Box sx={{ width: '40%'}}>
          {/* Navigation Buttons */}
          <Paper elevation={3} sx={{ p: 2 }} >
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
            <Box sx={{ height: '450px', padding: '5px',overflowY: 'auto' }}>
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
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color:'#CECECE'
                  }}>
                    <Typography variant="body2">
                      {video.title}
                    </Typography>
                    <Tooltip title={renderMetadataTooltip()} arrow>
                      <IconButton size="small" >
                        <InfoIcon style={{ color: '#CECECE'}} />
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

        {/* Right Panel - Video Player */}
        <Box sx={{ width: '55%', minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={3} sx={{ p: 2, flexGrow: 1 }} >
            {/* Title Bar */}
            <Box sx={{
              bgcolor: '#f5f5f5',
              p: 1,
              mb: 2,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Video Playback: {currentTitle}
                </Typography>
                <Typography variant="caption" color="textSecondary" style={{color: '#1565C0', cursor: 'pointer' }}>
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
                    borderRadius:'2px'
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Video Player */}
            <Box sx={{
              width: '100%',
              position: 'relative',
              paddingTop: '56.25%',
              bgcolor: '#000'
            }}>
              {renderVideo()}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* URL Input Section */}
      <Box sx={{
        mt: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1
      }} 
      style={{padding:'0px 30px'}}
      >
        <input
          type="text"
          placeholder="Enter URL and click enter or play button"
          style={{
            width: '80%',
            height: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          onClick={handlePlayCustomUrl}
          variant="contained"
          disabled={isLoading}
          sx={{
            bgcolor: '#1978CD',
            height: '40px',
            width: '120px'
          }}
        >
          {isLoading ? <CircularProgress size={20} /> : 'Play'}
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default VideoPlayer;