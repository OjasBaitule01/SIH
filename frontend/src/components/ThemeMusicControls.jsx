import React, { useState, useEffect } from 'react';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';

const ThemeMusicControls = () => {
  const [isDark, setIsDark] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio('https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0a13f69d2.mp3?filename=meditation-bowl-singing-bowl-zen-1-100230.mp3'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.2;
    if (isPlaying) {
      audio.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audio.pause();
    }
    return () => audio.pause();
  }, [isPlaying, audio]);

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        title="Toggle Background Music"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
      <button 
        onClick={() => setIsDark(!isDark)}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        title="Toggle Theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};

export default ThemeMusicControls;
