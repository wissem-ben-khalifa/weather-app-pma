import React from 'react';

function YoutubeVideos({ videos }) {
  return (
    <div className="videos card">
      <h2>Videos — {videos.location}</h2>
      <div className="videos-grid">
        {videos.videos.map((video, index) => (
          <div key={index} className="video-card">
            <a
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="video-link"
            >
              <div className="video-thumbnail">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="thumbnail-img"
                />
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                </div>
              </div>
              <div className="video-info">
                <p className="video-title">{video.title}</p>
                <p className="video-channel">{video.channel}</p>
                <p className="video-description">
                  {video.description.slice(0, 100)}
                  {video.description.length > 100 ? '...' : ''}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YoutubeVideos;