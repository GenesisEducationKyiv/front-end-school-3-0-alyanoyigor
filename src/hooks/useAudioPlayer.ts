import { useRef, useState, useEffect } from 'react';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  isMuted: boolean;
  isDirty: boolean;
  currentTime: number;
  duration: number;
  progressRef: React.RefObject<HTMLDivElement | null>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  handlePlayPause: () => void;
  handleMute: () => void;
  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleTimeUpdate: () => void;
  handleLoadedMetadata: () => void;
  formatTime: (time: number) => string;
}

export function useAudioPlayer(
  id: string,
  audioFile?: string
): UseAudioPlayerReturn {
  const { currentPlayingId, setCurrentPlayingId } = useAudioPlayerContext();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const prevAudioFile = useRef<string | null>(audioFile);

  // If the current playing id is not the id of the audio file, pause the audio
  useEffect(() => {
    if (currentPlayingId !== id && isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [currentPlayingId, id, isPlaying]);

  // If the audio file is not available, set the player to the initial state
  useEffect(() => {
    if (!audioFile || audioFile !== prevAudioFile.current) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsDirty(false);
      setCurrentTime(0);
      setDuration(0);
    }

    prevAudioFile.current = audioFile;
  }, [audioFile]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (!isDirty) {
        setIsDirty(true);
      }
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentPlayingId(null);
      } else {
        setCurrentPlayingId(id);
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);

      if (Math.floor(time) === Math.floor(duration)) {
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentPlayingId(null);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    isPlaying,
    isMuted,
    isDirty,
    currentTime,
    duration,
    progressRef,
    audioRef,
    handlePlayPause,
    handleMute,
    handleSeek,
    handleTimeUpdate,
    handleLoadedMetadata,
    formatTime,
  };
}
