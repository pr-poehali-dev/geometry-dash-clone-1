import { useEffect, useRef, useState } from 'react';

export function useMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('musicMuted');
    return saved === 'true';
  });

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      localStorage.setItem('musicMuted', String(isMuted));
    }
  }, [isMuted]);

  const play = (src?: string) => {
    if (audioRef.current) {
      if (src && audioRef.current.src !== src) {
        audioRef.current.src = src;
      }
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return { play, pause, toggleMute, isPlaying, isMuted };
}

export function useSound() {
  const playSound = (frequency: number, duration: number, volume: number = 0.1) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  };

  const jumpSound = () => playSound(400, 0.1);
  const deathSound = () => playSound(150, 0.3);
  const victorySound = () => {
    playSound(523, 0.1);
    setTimeout(() => playSound(659, 0.1), 100);
    setTimeout(() => playSound(784, 0.2), 200);
  };

  return { jumpSound, deathSound, victorySound };
}
