import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import VideoPlayerView from './components/VideoPlayerView';
import VideoThumbnail from './components/VideoThumbnail';
import { videos } from './data/videoData';

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
        if (url.includes('/shorts/')) return url.split('/shorts/')[1].split('?')[0];
        if (url.includes('watch?v=')) return new URLSearchParams(urlObj.search).get('v');
        if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1);
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

  return (
    <Box sx={{ margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: '#FFAB41',
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4,
          height: 60
        }}
      >
        <Typography sx={{ color: '#1978CD', fontSize: '20px' }}>
          Dori UX Interview: <Box component="span" sx={{ color: '#fff' }}>Sreenath</Box>
        </Typography>
        <Typography sx={{ color: '#1978CD', fontSize: '20px' }}>
          Today's Date: <Box component="span" sx={{ color: '#fff' }}>{new Date().toDateString()}</Box>
        </Typography>
      </Box>

      {/* Main Layout */}
      <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
        <VideoThumbnail
          videos={videos}
          currentVideoIndex={currentVideoIndex}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleThumbnailClick={handleThumbnailClick}
        />
        <VideoPlayerView
          videoType={videoType}
          currentVideoUrl={currentVideoUrl}
          currentTitle={currentTitle}
          videoMetadata={videoMetadata}
          truncateUrl={truncateUrl}
        />
      </Box>

      {/* URL Input Section */}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1
        }}
        style={{ padding: '0px 30px' }}
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
          onKeyPress={(e) => e.key === 'Enter' && handlePlayCustomUrl()}
        />
        <Button
          onClick={handlePlayCustomUrl}
          variant="contained"
          disabled={isLoading}
          sx={{
            bgcolor: '#1978CD',
            height: '40px',
            width: '120px',
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
          }}
        >
          {isLoading ? <CircularProgress size={20} /> : 'Play'}
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default VideoPlayer;
