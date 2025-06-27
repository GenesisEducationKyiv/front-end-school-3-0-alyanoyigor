import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { useEffect, useRef, useState } from 'react';

interface UseAudioPlayerReturn {
  isMuted: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progressRef: React.RefObject<HTMLDivElement | null> | null;
  audioRef: React.RefObject<HTMLAudioElement | null> | null;
  isDirty: boolean;
  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleTimeUpdate: () => void;
  handleLoadedMetadata: () => void;
  handlePlayPause: () => void;
  handleMute: () => void;
}

export function useAudioPlayer(
  id: string,
  audioFile?: string
): UseAudioPlayerReturn {
  const activeTrackId = useAudioPlayerStore((state) => state.activeTrackId);
  const setActiveTrackId = useAudioPlayerStore(
    (state) => state.setActiveTrackId
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const prevAudioFile = useRef<string>(audioFile);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  // If the current playing id is not the id of the audio file, pause the audio
  useEffect(() => {
    if (activeTrackId !== id) {
      resetAudioPlayer();
    }
  }, [activeTrackId, id]);

  // If the audio file is not available, set the player to the initial state
  useEffect(() => {
    if (!audioFile || audioFile !== prevAudioFile.current) {
      resetAudioPlayer();
    }

    prevAudioFile.current = audioFile;
  }, [audioFile]);

  const resetAudioPlayer = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isDirty) {
      setIsDirty(true);
    }
    setActiveTrackId(id);

    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = audio.currentTime;

    if (time >= duration) {
      setCurrentTime(0);
      setIsPlaying(false);
    } else {
      setCurrentTime(time);
    }
  };
  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progress = progressRef.current;

    if (!audio || !progress) return;

    const rect = progress.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return {
    isMuted,
    isPlaying,
    currentTime,
    duration,
    progressRef,
    audioRef,
    isDirty,
    handleSeek,
    handleTimeUpdate,
    handleLoadedMetadata,
    handlePlayPause,
    handleMute,
  };
}
