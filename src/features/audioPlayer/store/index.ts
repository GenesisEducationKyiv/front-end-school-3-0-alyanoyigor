import z from 'zod';
import { create } from 'zustand';

export const AudioPlayerContextSchema = z.enum(['main', 'modal']);
export type AudioPlayerContext = z.infer<typeof AudioPlayerContextSchema>;

export const AudioPlayerStatusSchema = z.enum(['playing', 'paused']);
export type AudioPlayerStatus = z.infer<typeof AudioPlayerStatusSchema>;

interface AudioPlayerStore {
  activeTrackId: string | null;
  setActiveTrackId: (id: string | null) => void;
}

export const useAudioPlayerStore = create<AudioPlayerStore>((set) => ({
  activeTrackId: null,
  setActiveTrackId: (id) => set({ activeTrackId: id }),
}));
