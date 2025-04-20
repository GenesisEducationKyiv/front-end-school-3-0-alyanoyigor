import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';
import { Track } from '@/types';

interface TrackItemProps {
  track: Track;
}

export function TrackItem({ track }: TrackItemProps) {
  return (
    <Card className="group hover:bg-accent/50 transition-colors">
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            {track.coverImage ? (
              <img
                src={track.coverImage}
                alt={track.title}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                <Play className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{track.title}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {track.artist}
              {track.album && ` • ${track.album}`}
            </p>
            <div className="flex gap-1 mt-1 flex-wrap">
              {track.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
